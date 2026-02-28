import type { NextApiRequest, NextApiResponse } from "next";

/**
 * NIP-05 Nostr-Verifikation
 * Erreichbar über: /.well-known/nostr.json?name=pinky  (Rewrite in vercel.json)
 * Spec: https://github.com/nostr-protocol/nips/blob/master/05.md
 */

const NOSTR_NAMES: Record<string, string> = {
  pinky: "77f311333f05f908951d71dcfc44653f8f062e4e4ae054f5c5e32353aff0faae",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS-Header – von Nostr-Clients zwingend benötigt
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const name = req.query.name;

  // Kein name-Parameter → leeres Objekt
  if (!name || Array.isArray(name)) {
    return res.status(200).json({ names: {} });
  }

  const pubkey = NOSTR_NAMES[name.toLowerCase()];

  return res.status(200).json({
    names: pubkey ? { [name.toLowerCase()]: pubkey } : {},
  });
}
