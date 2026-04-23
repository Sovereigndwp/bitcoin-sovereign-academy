/**
 * Lightning Invoice Creation via LNURL-pay
 * Uses the configured Lightning address (no local node required).
 * Alby's servers handle the LNURL endpoint; payments settle to your wallet.
 *
 * POST /api/lightning/create-invoice
 * Body: { amount, description, expirySeconds }
 */

const LIGHTNING_ADDRESS = process.env.LIGHTNING_ADDRESS || 'dulcetsurf67367@getalby.com';
const APPRENTICE_DEPOSIT_SATS = 50_000;
const APPRENTICE_DEPOSIT_MSATS = APPRENTICE_DEPOSIT_SATS * 1000;

export default async function handler(req, res) {
  // CORS headers — never fall back to wildcard for payment endpoints
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, description, expirySeconds } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Missing required fields: amount, description' });
    }

    if (!Number.isInteger(amount) || amount !== APPRENTICE_DEPOSIT_SATS) {
      return res.status(400).json({ error: `Amount must be exactly ${APPRENTICE_DEPOSIT_SATS} sats` });
    }

    // Step 1: Resolve the Lightning address to its LNURL-pay endpoint
    const [user, domain] = LIGHTNING_ADDRESS.split('@');
    if (!user || !domain) {
      return res.status(500).json({ error: 'Invalid Lightning address configured' });
    }

    const lnurlEndpoint = `https://${domain}/.well-known/lnurlp/${user}`;
    const lnurlResponse = await fetch(lnurlEndpoint, {
      headers: { 'User-Agent': 'BitcoinSovereignAcademy/1.0' }
    });

    if (!lnurlResponse.ok) {
      console.error('[Lightning] LNURL fetch failed:', lnurlResponse.status);
      return res.status(502).json({ error: 'Failed to reach Lightning address provider' });
    }

    const lnurlData = await lnurlResponse.json();

    if (lnurlData.status === 'ERROR') {
      console.error('[Lightning] LNURL error:', lnurlData.reason);
      return res.status(502).json({ error: lnurlData.reason || 'Lightning address error' });
    }

    // Step 2: Confirm amount is within the allowed range
    if (APPRENTICE_DEPOSIT_MSATS < lnurlData.minSendable || APPRENTICE_DEPOSIT_MSATS > lnurlData.maxSendable) {
      return res.status(400).json({
        error: `Amount ${APPRENTICE_DEPOSIT_SATS} sats is outside the allowed range for this Lightning address`
      });
    }

    // Step 3: Request an invoice from the callback URL
    const callbackUrl = new URL(lnurlData.callback);
    callbackUrl.searchParams.set('amount', String(APPRENTICE_DEPOSIT_MSATS));
    if (description) {
      callbackUrl.searchParams.set('comment', description.substring(0, 144));
    }

    const invoiceResponse = await fetch(callbackUrl.toString(), {
      headers: { 'User-Agent': 'BitcoinSovereignAcademy/1.0' }
    });

    if (!invoiceResponse.ok) {
      console.error('[Lightning] Invoice callback failed:', invoiceResponse.status);
      return res.status(502).json({ error: 'Failed to generate Lightning invoice' });
    }

    const invoiceData = await invoiceResponse.json();

    if (invoiceData.status === 'ERROR' || !invoiceData.pr) {
      console.error('[Lightning] Invoice generation error:', invoiceData.reason);
      return res.status(502).json({ error: invoiceData.reason || 'Failed to generate invoice' });
    }

    // Decode the payment hash from the BOLT11 invoice prefix
    // (Full decode not needed — the hash is returned by some providers)
    const paymentHash = invoiceData.payment_hash || invoiceData.paymentHash || null;

    console.log('[Lightning] Invoice created via LNURL-pay:', {
      lightningAddress: LIGHTNING_ADDRESS,
      amount: APPRENTICE_DEPOSIT_SATS,
      hasPaymentHash: !!paymentHash
    });

    return res.status(200).json({
      success: true,
      paymentRequest: invoiceData.pr,
      paymentHash: paymentHash,
      amount: APPRENTICE_DEPOSIT_SATS,
      description,
      expiresAt: new Date(Date.now() + (expirySeconds || 3600) * 1000).toISOString()
    });

  } catch (error) {
    console.error('[Lightning] Error creating invoice:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Lightning payment processing failed'
    });
  }
}
