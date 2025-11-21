#!/usr/bin/env node

/**
 * Fetches recent reachable Bitcoin nodes from Bitnodes and persists them
 * to `public/data/bitnodes-cache.json` for offline use inside the globe.
 *
 * The Bitnodes API exposes geolocation data via the node detail endpoint,
 * but it enforces a fairly strict rate-limit (~30 req/min). To stay well
 * within that boundary we throttle requests and only collect a configurable
 * subset of nodes per run.
 */

const fs = require("fs/promises");
const path = require("path");

const SNAPSHOT_URL = "https://bitnodes.io/api/v1/snapshots/latest/";
const NODE_DETAIL_URL = (address) =>
  `https://bitnodes.io/api/v1/nodes/${address.replace(":", "-")}/`;

const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "bitnodes-cache.json"
);

const MAX_NODES = Number(process.env.MAX_NODES || 150);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 2000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyNode(userAgent) {
  if (!userAgent) return "core";
  return userAgent.toLowerCase().includes("knots") ? "knots" : "core";
}

function isPublicIPv4(address) {
  if (!address) return false;
  if (address.includes(".onion")) return false;
  if (address.includes(":") && !address.includes("."))
    return false; // skip IPv6 for now
  return true;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} for ${url}`);
  }
  return res.json();
}

async function main() {
  console.log("Fetching latest Bitnodes snapshot…");
  const snapshot = await fetchJson(SNAPSHOT_URL);
  const allNodes = Object.keys(snapshot.nodes).filter(isPublicIPv4);
  console.log(`Found ${allNodes.length} public IPv4 nodes.`);

  const selected = allNodes.slice(0, MAX_NODES);
  const results = [];

  for (let i = 0; i < selected.length; i++) {
    const address = selected[i];

    try {
      const detail = await fetchJson(NODE_DETAIL_URL(address));
      const data = detail.data || [];
      const lat = data[8];
      const lon = data[9];
      if (typeof lat !== "number" || typeof lon !== "number") {
        console.warn(`Skipping ${address} – latitude/longitude missing`);
      } else {
        results.push({
          address,
          type: classifyNode(data[1]),
          lat,
          lon,
          city: data[6] || null,
          country: data[7] || null,
          asn: data[11] || null,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch ${address}: ${err.message}`);
    }

    if (i < selected.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    totalNodes: results.length,
    source: SNAPSHOT_URL,
    nodes: results,
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`Saved ${results.length} nodes to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


