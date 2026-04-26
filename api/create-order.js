/**
 * Zaprite Order Creation API
 * Creates a new payment order via Zaprite API
 *
 * POST /api/create-order
 * Body: { product, userId, amount, currency, label }
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product, userId, amount, currency, label } = req.body;

    // Validate required fields
    if (!product || !userId || !amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['product', 'userId', 'amount', 'currency']
      });
    }

    // Validate product type
    const validProducts = ['curious_path', 'builder_path', 'sovereign_path', 'full_academy'];
    if (!validProducts.includes(product)) {
      return res.status(400).json({
        error: 'Invalid product',
        validProducts
      });
    }

    // Get Zaprite API key from environment
    const ZAPRITE_API_KEY = process.env.ZAPRITE_API_KEY;
    if (!ZAPRITE_API_KEY) {
      console.error('ZAPRITE_API_KEY not configured');
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    // Generate unique external ID
    const externalUniqId = `bsa_${product}_${userId}_${Date.now()}`;

    // Determine redirect URLs based on environment
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || 'https://bitcoinsovereign.academy';

    const successUrl = `${baseUrl}/payment/success?order={orderId}&product=${product}`;
    const cancelUrl = `${baseUrl}/pricing`;

    // Create Zaprite order
    const zapriteResponse = await fetch('https://api.zaprite.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': ZAPRITE_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'BitcoinSovereignAcademy/1.0'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        external_uniq_id: externalUniqId,
        redirect_url: successUrl,
        cancel_url: cancelUrl,
        label: label || `Bitcoin Sovereign Academy - ${product}`,
        metadata: {
          user_id: userId,
          product: product,
          source: 'web',
          timestamp: new Date().toISOString()
        }
      })
    });

    // Check if request was successful
    if (!zapriteResponse.ok) {
      const errorText = await zapriteResponse.text();
      console.error('Zaprite API error:', zapriteResponse.status, errorText);

      return res.status(500).json({
        error: 'Failed to create payment order',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    const zapriteData = await zapriteResponse.json();

    // Log successful order creation (for debugging)
    console.log('Order created:', {
      orderId: zapriteData.id,
      product,
      amount,
      currency,
      externalUniqId
    });

    // Return checkout URL and order ID
    return res.status(200).json({
      success: true,
      orderId: zapriteData.id,
      checkoutUrl: zapriteData.checkout_url || zapriteData.url,
      externalUniqId: externalUniqId,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating order:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Payment processing failed'
    });
  }
}
