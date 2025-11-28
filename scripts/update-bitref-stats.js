#!/usr/bin/env node

/**
 * Fetches Bitcoin node statistics from bitref.com/nodes/ via web scraping.
 * Extracts: Bitcoin Core, Core V.30, Bitcoin Knots, Tor Network, Total Public
 */

const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");

const BITREF_URL = "https://bitref.com/nodes/";
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "bitref-stats.json"
);

async function scrapeBitrefStats() {
  console.log("Launching browser…");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    
    console.log(`Navigating to ${BITREF_URL}…`);
    await page.goto(BITREF_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Wait for the statistics to load (the page shows "loading..." initially)
    console.log("Waiting for statistics to load…");
    // Wait for actual numbers to appear (not just "loading...")
    await page.waitForFunction(
      () => {
        const bodyText = document.body.innerText;
        // Check if we have actual large numbers (4+ digits) and "Total Public" is not showing "loading..."
        const hasLargeNumbers = bodyText.match(/\d{4,}/) !== null;
        const totalPublicLoaded = bodyText.match(/Total Public Nodes[\s\S]*?\d{4,}/) !== null;
        const notLoading = !bodyText.includes("Total Public Nodes\nloading...");
        return hasLargeNumbers && (totalPublicLoaded || notLoading);
      },
      { timeout: 45000 }
    );
    
    // Give it extra time for all data to fully load
    console.log("Data detected, waiting for full load…");
    await page.waitForTimeout(5000);

    // Extract data from the page
    // The page structure shows statistics in various elements
    // We'll look for the summary section and tables
    const stats = await page.evaluate(() => {
      const result = {
        bitcoinCore: null,
        coreV30: null,
        bitcoinKnots: null,
        torNetwork: null,
        totalPublic: null,
      };

      // Try to find the statistics in the page
      // Look for text patterns and extract numbers
      const bodyText = document.body.innerText;

      // Extract "Total Public Nodes" - number appears BEFORE "Total Public Nodes"
      // Pattern: 23624\nTotal Public Nodes
      const totalMatch = bodyText.match(/(\d{4,})\s*\n\s*Total Public Nodes/i);
      if (totalMatch) {
        result.totalPublic = parseInt(totalMatch[1].replace(/,/g, ""), 10);
      }

      // Look for Tor Network Nodes - number appears BEFORE "Tor Network Nodes" with percentage
      // Pattern: 14880 (62.99%)\nTor Network Nodes
      const torMatch = bodyText.match(/(\d{4,}[\d,]*)\s*\([\d.]+%\)\s*\n\s*Tor Network Nodes/i);
      if (torMatch) {
        result.torNetwork = parseInt(torMatch[1].replace(/,/g, ""), 10);
      }

      // Extract from table: "Bitcoin Node Clients Ranked by Popularity"
      // Pattern: 1\tBitcoin Core\t18536\t78.46%
      const coreMatch = bodyText.match(/1\s+Bitcoin Core\s+(\d[\d,]+)/i);
      if (coreMatch) {
        result.bitcoinCore = parseInt(coreMatch[1].replace(/,/g, ""), 10);
      }

      // Extract Bitcoin Knots from table
      const knotsMatch = bodyText.match(/2\s+Bitcoin Knots\s+(\d[\d,]+)/i);
      if (knotsMatch) {
        result.bitcoinKnots = parseInt(knotsMatch[1].replace(/,/g, ""), 10);
      }

      // Extract Core V.30 from "Top Bitcoin Node User Agents" table
      // Pattern: 1\t/Satoshi:30.0.0/\t3.023\t12.80%
      // Note: The number is in thousands format (3.023 = 3023)
      const v30Match = bodyText.match(/\/Satoshi:30\.0\.0\/\s+(\d[\d,.]+)/i);
      if (v30Match) {
        // Handle numbers with dots (like 3.023 which means 3023 in thousands)
        const v30Value = v30Match[1].replace(/,/g, "");
        result.coreV30 = Math.round(parseFloat(v30Value) * 1000);
      }

      // Alternative: Try to extract from tables
      const tables = document.querySelectorAll("table");
      for (const table of tables) {
        const rows = table.querySelectorAll("tr");
        for (const row of rows) {
          const cells = row.querySelectorAll("td, th");
          if (cells.length >= 2) {
            const label = cells[0].textContent.trim();
            const value = cells[1].textContent.trim().replace(/,/g, "");
            const numValue = parseInt(value, 10);

            if (!isNaN(numValue)) {
              if (label.includes("Bitcoin Core") && !label.includes("Knots")) {
                if (!result.bitcoinCore) result.bitcoinCore = numValue;
              } else if (label.includes("Bitcoin Knots")) {
                result.bitcoinKnots = numValue;
              } else if (label.includes("Tor") || label.includes("tor")) {
                if (!result.torNetwork) result.torNetwork = numValue;
              } else if (label.includes("30") || label.includes("V.30")) {
                result.coreV30 = numValue;
              } else if (label.includes("Total") && label.includes("Public")) {
                result.totalPublic = numValue;
              }
            }
          }
        }
      }

      // Try to find in the summary section (usually at the top)
      const summaryElements = document.querySelectorAll("h2, h3, .summary, .stats");
      for (const elem of summaryElements) {
        const text = elem.textContent;
        const numMatch = text.match(/(\d[\d,]*)/);
        if (numMatch) {
          const num = parseInt(numMatch[1].replace(/,/g, ""), 10);
          if (text.includes("Total Public") && !result.totalPublic) {
            result.totalPublic = num;
          } else if (text.includes("Tor") && !result.torNetwork) {
            result.torNetwork = num;
          }
        }
      }

      return result;
    });

    // If we couldn't extract all data, try a more aggressive approach
    if (!stats.totalPublic || !stats.bitcoinCore) {
      console.log("\n⚠️  Some data missing, trying alternative extraction…");
      
      // Get the full page HTML and try regex patterns
      const html = await page.content();
      
      // Look for JSON data embedded in the page
      const jsonMatch = html.match(/<script[^>]*>[\s\S]*?({[\s\S]*?"nodes"[\s\S]*?})[\s\S]*?<\/script>/i);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[1]);
          console.log("Found embedded JSON data");
          // Process jsonData if it contains node statistics
        } catch (e) {
          // Not valid JSON, continue
        }
      }

      // Try alternative extraction from HTML if still missing
      if (!stats.totalPublic) {
        const totalHtmlMatch = html.match(/(\d{4,})[\s\S]{0,300}?Total\s+Public\s+Nodes/i);
        if (totalHtmlMatch) {
          stats.totalPublic = parseInt(totalHtmlMatch[1].replace(/,/g, ""), 10);
          console.log(`  Found totalPublic from HTML: ${stats.totalPublic}`);
        }
      }
      
      if (!stats.bitcoinCore) {
        const coreHtmlMatch = html.match(/1[\s\t]+Bitcoin\s+Core[\s\t]+(\d[\d,]+)/i);
        if (coreHtmlMatch) {
          stats.bitcoinCore = parseInt(coreHtmlMatch[1].replace(/,/g, ""), 10);
          console.log(`  Found bitcoinCore from HTML: ${stats.bitcoinCore}`);
        }
      }
      
      if (!stats.bitcoinKnots) {
        const knotsHtmlMatch = html.match(/2[\s\t]+Bitcoin\s+Knots[\s\t]+(\d[\d,]+)/i);
        if (knotsHtmlMatch) {
          stats.bitcoinKnots = parseInt(knotsHtmlMatch[1].replace(/,/g, ""), 10);
          console.log(`  Found bitcoinKnots from HTML: ${stats.bitcoinKnots}`);
        }
      }
      
      if (!stats.torNetwork) {
        const torHtmlMatch = html.match(/Tor\s+Network\s+Nodes[\s\S]{0,200}?(\d[\d,]+)/i);
        if (torHtmlMatch) {
          stats.torNetwork = parseInt(torHtmlMatch[1].replace(/,/g, ""), 10);
          console.log(`  Found torNetwork from HTML: ${stats.torNetwork}`);
        }
      }
      
      if (!stats.coreV30) {
        const v30HtmlMatch = html.match(/\/Satoshi:30\.0\.0\/[\s\t]+(\d[\d,.]+)/i);
        if (v30HtmlMatch) {
          const v30Value = v30HtmlMatch[1].replace(/,/g, "");
          stats.coreV30 = Math.round(parseFloat(v30Value) * 1000);
          console.log(`  Found coreV30 from HTML: ${stats.coreV30}`);
        }
      }
    }

    // Validate and calculate percentages
    if (!stats.totalPublic || stats.totalPublic === 0) {
      throw new Error("Could not extract Total Public Nodes");
    }

    const output = {
      updatedAt: new Date().toISOString(),
      bitcoinCore: {
        total: stats.bitcoinCore || 0,
        percentage: stats.bitcoinCore
          ? ((stats.bitcoinCore / stats.totalPublic) * 100).toFixed(1)
          : "0.0",
      },
      coreV30: {
        total: stats.coreV30 || 0,
        percentage: stats.coreV30
          ? ((stats.coreV30 / stats.totalPublic) * 100).toFixed(1)
          : "0.0",
      },
      bitcoinKnots: {
        total: stats.bitcoinKnots || 0,
        percentage: stats.bitcoinKnots
          ? ((stats.bitcoinKnots / stats.totalPublic) * 100).toFixed(1)
          : "0.0",
      },
      torNetwork: {
        total: stats.torNetwork || 0,
        percentage: stats.torNetwork
          ? ((stats.torNetwork / stats.totalPublic) * 100).toFixed(1)
          : "0.0",
      },
      totalPublic: {
        total: stats.totalPublic,
      },
    };

    console.log("\n✅ Extracted statistics:");
    console.log(`  Total Public: ${output.totalPublic.total.toLocaleString()}`);
    console.log(`  Bitcoin Core: ${output.bitcoinCore.total.toLocaleString()} (${output.bitcoinCore.percentage}%)`);
    console.log(`  Core V.30: ${output.coreV30.total.toLocaleString()} (${output.coreV30.percentage}%)`);
    console.log(`  Bitcoin Knots: ${output.bitcoinKnots.total.toLocaleString()} (${output.bitcoinKnots.percentage}%)`);
    console.log(`  Tor Network: ${output.torNetwork.total.toLocaleString()} (${output.torNetwork.percentage}%)`);

    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");

    console.log(`\n✅ Statistics saved to: ${OUTPUT_FILE}`);
    return output;
  } finally {
    await browser.close();
  }
}

scrapeBitrefStats().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

