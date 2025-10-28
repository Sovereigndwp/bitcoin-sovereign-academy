/**
 * Core types for Bitcoin Sovereign Academy monetization system
 */

// Product & Pricing Types
export interface Module {
  id: string;
  title: string;
  path: string;
  stage: number;
  priceUSD: number;
}

export interface Path {
  id: string;
  name: string;
  modules: Module[];
  bundlePriceUSD: number;
}

export interface CartItem {
  type: 'module' | 'path' | 'bundle';
  id: string;
  title: string;
  priceUSD: number;
}

export interface PricingRequest {
  items: CartItem[];
}

export interface PricingResponse {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: 'USD';
}

// Payment Types
export type PaymentProvider = 'stripe' | 'btcpay';

export interface CheckoutRequest {
  items: CartItem[];
  provider: PaymentProvider;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResponse {
  provider: 'stripe';
  sessionId: string;
  url: string;
}

export interface BTCPayCheckoutResponse {
  provider: 'btcpay';
  invoiceId: string;
  url: string;
  btcAddress?: string;
  amount?: string;
}

export type CheckoutResponse = StripeCheckoutResponse | BTCPayCheckoutResponse;

// Webhook Types
export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

export interface BTCPayWebhookEvent {
  deliveryId: string;
  webhookId: string;
  originalDeliveryId: string;
  isRedelivery: boolean;
  type: string;
  timestamp: number;
  storeId: string;
  invoiceId: string;
  overPaid?: boolean;
}

// Entitlement Types
export interface Entitlement {
  userId: string;
  email: string;
  modules: string[];
  paths: string[];
  purchaseDate: string;
  expiresAt?: string;
}

export interface JWTPayload extends Entitlement {
  iat: number;
  exp?: number;
}

// Error Types
export interface APIError {
  error: string;
  message: string;
  code?: string;
}
