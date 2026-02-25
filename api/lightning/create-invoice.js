/**
 * Alby Hub Lightning Invoice Creation API
 * Creates Lightning invoices through Alby Hub API
 * 
 * POST /api/lightning/create-invoice
 * Body: { amount, description, expirySeconds }
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, expirySeconds } = req.body;

    // Validate required fields
    if (!amount || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'description']
      });
    }

    // Validate amount (must be positive integer in sats)
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive integer (sats)'
      });
    }

    // Get Alby Hub configuration from environment
    const ALBY_HUB_URL = process.env.ALBY_HUB_URL;
    const ALBY_API_KEY = process.env.ALBY_API_KEY;

    if (!ALBY_HUB_URL || !ALBY_API_KEY) {
      console.error('Alby Hub configuration missing');
      return res.status(500).json({ 
        error: 'Lightning payment system not configured',
        details: process.env.NODE_ENV === 'development' ? 'Missing ALBY_HUB_URL or ALBY_API_KEY' : undefined
      });
    }

    // Prepare invoice data
    const invoiceData = {
      amount: amount, // Amount in sats
      description: description,
      expiry: expirySeconds || 3600 // Default 1 hour
    };

    console.log('Creating invoice with Alby Hub:', {
      amount,
      description: description.substring(0, 50) + '...',
      hubUrl: ALBY_HUB_URL
    });

    // Create invoice via Alby Hub API
    const albyResponse = await fetch(`${ALBY_HUB_URL}/api/invoices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ALBY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BitcoinSovereignAcademy/1.0'
      },
      body: JSON.stringify(invoiceData)
    });

    // Check if request was successful
    if (!albyResponse.ok) {
      const errorText = await albyResponse.text();
      console.error('Alby Hub API error:', albyResponse.status, errorText);

      return res.status(500).json({
        error: 'Failed to create Lightning invoice',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    const albyData = await albyResponse.json();

    // Log successful invoice creation
    console.log('Lightning invoice created:', {
      paymentHash: albyData.payment_hash,
      amount: amount,
      description: description.substring(0, 50) + '...'
    });

    // Return invoice details
    return res.status(200).json({
      success: true,
      paymentRequest: albyData.payment_request,
      paymentHash: albyData.payment_hash,
      amount: amount,
      description: description,
      expiresAt: new Date(Date.now() + (invoiceData.expiry * 1000)).toISOString()
    });

  } catch (error) {
    console.error('Error creating Lightning invoice:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Lightning payment processing failed'
    });
  }
}

