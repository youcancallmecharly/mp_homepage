import type { NextApiRequest, NextApiResponse } from "next";

/**
 * LNURL-pay Step 2 – Invoice-Callback
 * GET /api/lnurlp/callback?amount=<msats>
 * Spec: https://github.com/lnurl/luds/blob/luds/06.md
 *
 * Ruft phoenixd POST /createinvoice auf und gibt BOLT11 zurück.
 *
 * Benötigte Env-Variablen:
 *   PHOENIXD_URL      z.B. http://45.76.179.22:9740
 *   PHOENIXD_PASSWORD  HTTP-API-Passwort aus ~/.phoenix/phoenix.conf
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: "ERROR", reason: "Method not allowed" });
  }

  const phoenixdUrl = process.env.PHOENIXD_URL;
  const phoenixdPassword = process.env.PHOENIXD_PASSWORD;

  if (!phoenixdUrl || !phoenixdPassword) {
    console.error("LNURL callback: PHOENIXD_URL oder PHOENIXD_PASSWORD fehlt");
    return res.status(500).json({ status: "ERROR", reason: "Server misconfigured" });
  }

  // amount kommt in Millisatoshi
  const amountMsatRaw = req.query.amount;
  if (!amountMsatRaw || Array.isArray(amountMsatRaw)) {
    return res.status(400).json({ status: "ERROR", reason: "amount fehlt oder ungültig" });
  }

  const amountMsat = parseInt(amountMsatRaw, 10);
  if (isNaN(amountMsat) || amountMsat <= 0) {
    return res.status(400).json({ status: "ERROR", reason: "amount muss eine positive Zahl sein" });
  }

  // phoenixd erwartet Satoshi (msat / 1000), muss ganzzahlig sein
  const amountSat = Math.floor(amountMsat / 1000);
  if (amountSat < 1) {
    return res.status(400).json({ status: "ERROR", reason: "Betrag zu klein (min. 1 Sat)" });
  }

  // HTTP Basic Auth: leerer Username, Passwort aus Env
  const basicAuth = Buffer.from(`:${phoenixdPassword}`).toString("base64");

  const description = "Sende Sats an Pinky ⚡";

  try {
    const body = new URLSearchParams({
      amountSat: amountSat.toString(),
      description,
    });

    const phoenixResponse = await fetch(`${phoenixdUrl}/createinvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: body.toString(),
    });

    if (!phoenixResponse.ok) {
      const errorText = await phoenixResponse.text();
      console.error("phoenixd Fehler:", phoenixResponse.status, errorText);
      return res.status(502).json({
        status: "ERROR",
        reason: "Invoice-Erstellung fehlgeschlagen",
      });
    }

    const invoice = (await phoenixResponse.json()) as {
      serialized?: string; // BOLT11-String bei phoenixd
      [key: string]: unknown;
    };

    const paymentRequest = invoice.serialized;
    if (!paymentRequest) {
      console.error("phoenixd Antwort enthält kein 'serialized' Feld:", invoice);
      return res.status(502).json({ status: "ERROR", reason: "Ungültige Antwort von phoenixd" });
    }

    // LNURL-pay Step-2-Antwort
    return res.status(200).json({
      pr: paymentRequest,
      routes: [], // leer lassen (kein Routing-Hint nötig)
    });
  } catch (err) {
    console.error("Verbindungsfehler zu phoenixd:", err);
    return res.status(502).json({ status: "ERROR", reason: "Verbindung zu phoenixd fehlgeschlagen" });
  }
}
