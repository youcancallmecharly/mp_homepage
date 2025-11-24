#!/usr/bin/env node

/**
 * Fetches Bitcoin node data from Bitnodes and aggregates by country using GeoIP.
 * Creates a statistics file for the dropdown view.
 */

const fs = require("fs/promises");
const path = require("path");

const SNAPSHOT_URL = "https://bitnodes.io/api/v1/snapshots/latest/";
// Using ip-api.com (free, 45 req/min, no API key needed)
// Alternative: https://ipapi.co/{ip}/json/ (1000 req/day free)
const GEOIP_URL = (ip) => `http://ip-api.com/json/${ip}?fields=status,country,countryCode`;
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "node-stats.json"
);

const MAX_NODES = Number(process.env.MAX_NODES || 1000); // Process up to 1000 nodes
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1500); // ~40 req/min to stay safe

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyNode(userAgent) {
  if (!userAgent) return "core";
  return userAgent.toLowerCase().includes("knots") ? "knots" : "core";
}

function extractIP(address) {
  // Handle formats like "192.168.1.1:8333" or "192.168.1.1"
  if (address.includes(":")) {
    return address.split(":")[0];
  }
  return address;
}

function isPublicIPv4(ip) {
  if (!ip) return false;
  if (ip.includes(".onion")) return false;
  if (ip.includes(":") && !ip.includes(".")) return false; // IPv6
  // Basic IPv4 check
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} for ${url}`);
  }
  return res.json();
}

async function getCountryForIP(ip) {
  try {
    const geoData = await fetchJson(GEOIP_URL(ip));
    if (geoData.status === "success" && geoData.countryCode) {
      return {
        country: geoData.country,
        countryCode: geoData.countryCode,
      };
    }
    return { country: "Unknown", countryCode: "XX" };
  } catch (err) {
    console.warn(`GeoIP lookup failed for ${ip}: ${err.message}`);
    return { country: "Unknown", countryCode: "XX" };
  }
}

async function main() {
  console.log("Fetching latest Bitnodes snapshot…");
  const snapshot = await fetchJson(SNAPSHOT_URL);
  const nodes = snapshot.nodes || {};

  console.log(`Found ${Object.keys(nodes).length} nodes in snapshot.`);
  console.log(`Processing up to ${MAX_NODES} nodes with GeoIP lookup…`);

  const knotsByCountry = {};
  const coreByCountry = {};
  let knotsTotal = 0;
  let coreTotal = 0;
  let processed = 0;
  let skipped = 0;

  const nodeEntries = Object.entries(nodes);
  const toProcess = nodeEntries.slice(0, MAX_NODES);

  for (let i = 0; i < toProcess.length; i++) {
    const [address, nodeData] = toProcess[i];

    if (!nodeData || !Array.isArray(nodeData)) {
      skipped++;
      continue;
    }

    const ip = extractIP(address);
    if (!isPublicIPv4(ip)) {
      skipped++;
      continue;
    }

    const userAgent = nodeData[0] || "";
    const type = classifyNode(userAgent);

    // Get country via GeoIP
    const { country, countryCode } = await getCountryForIP(ip);

    if (type === "knots") {
      knotsTotal++;
      if (!knotsByCountry[countryCode]) {
        knotsByCountry[countryCode] = {
          countryCode,
          country,
          knots: 0,
        };
      }
      knotsByCountry[countryCode].knots++;
    } else {
      coreTotal++;
      if (!coreByCountry[countryCode]) {
        coreByCountry[countryCode] = {
          countryCode,
          country,
          core: 0,
        };
      }
      coreByCountry[countryCode].core++;
    }

    processed++;
    if (processed % 50 === 0) {
      console.log(`  Processed ${processed}/${toProcess.length} nodes…`);
    }

    // Rate limiting: wait between requests (except for the last one)
    if (i < toProcess.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  // Convert to arrays and sort by count (desc) initially
  const knotsArray = Object.values(knotsByCountry)
    .filter((item) => item.knots > 0)
    .sort((a, b) => b.knots - a.knots);

  const coreArray = Object.values(coreByCountry)
    .filter((item) => item.core > 0)
    .sort((a, b) => b.core - a.core);

  const output = {
    updatedAt: new Date().toISOString(),
    knots: {
      total: knotsTotal,
      byCountry: knotsArray,
    },
    core: {
      total: coreTotal,
      byCountry: coreArray,
    },
    meta: {
      processed,
      skipped,
      totalInSnapshot: Object.keys(nodes).length,
    },
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");

  console.log("\n✅ Statistics saved:");
  console.log(`  Knots: ${knotsTotal} total, ${knotsArray.length} countries`);
  console.log(`  Core: ${coreTotal} total, ${coreArray.length} countries`);
  console.log(`  Processed: ${processed}, Skipped: ${skipped}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

