import type { NextApiRequest, NextApiResponse } from "next";

/**
 * LNURL-pay Step 1 – Metadata Endpoint
 * Erreichbar über: /.well-known/lnurlp/pinky  (Rewrite in next.config.mjs)
 * Spec: https://github.com/lnurl/luds/blob/luds/06.md
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: "ERROR", reason: "Method not allowed" });
  }

  // Domain aus dem Host-Header bestimmen (funktioniert lokal & auf Vercel)
  const host = req.headers.host ?? "";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const callbackUrl = `${proto}://${host}/api/lnurlp/callback`;

  // metadata: JSON-Array als String (LUD-06)
  const metadata = JSON.stringify([
    ["text/plain", "Sende Sats an Pinky ⚡"],
    ["text/identifier", `pinky@${host}`],
  ]);

  return res.status(200).json({
    status: "OK",
    tag: "payRequest",
    callback: callbackUrl,
    minSendable: 1000,          // 1 Sat in msat
    maxSendable: 1_000_000_000, // 1.000.000 Sat in msat
    metadata,
  });
}
