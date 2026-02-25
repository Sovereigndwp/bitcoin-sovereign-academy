#!/usr/bin/env node
/**
 * Test script for Lightning invoice creation
 * Run with: node test-lightning.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testLightningInvoice() {
  console.log('🧪 Testing Lightning invoice creation...');
  console.log(`Using base URL: ${BASE_URL}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/lightning/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000, // 1000 sats for testing
        description: 'Test Invoice - BSA Lightning Integration',
        expirySeconds: 3600
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error}`);
    }

    const invoice = await response.json();
    
    console.log('✅ Invoice created successfully!');
    console.log(`Payment Hash: ${invoice.paymentHash}`);
    console.log(`Amount: ${invoice.amount} sats`);
    console.log(`Expires: ${invoice.expiresAt}`);
    console.log('\n📱 Payment Request (copy to Lightning wallet):');
    console.log(invoice.paymentRequest);
    console.log('\n🔗 Or scan this QR code:');
    console.log(`data:image/svg+xml;base64,${invoice.qrCode}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Lightning payment system not configured')) {
      console.log('\n💡 Setup required:');
      console.log('1. Add ALBY_HUB_URL to your .env.local');
      console.log('2. Add ALBY_API_KEY to your .env.local');
      console.log('3. Make sure your Alby Hub is accessible');
    }
  }
}

// Run if called directly
if (require.main === module) {
  testLightningInvoice();
}

module.exports = { testLightningInvoice };