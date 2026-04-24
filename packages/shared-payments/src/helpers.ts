import { PRODUCTS } from './products.js';
import type { ProductConfig } from './types.js';

export const FREE_DEMOS = ['bitcoin-price-timeline', 'energy-bucket'];

export function getProduct(productId: string): ProductConfig | undefined {
  return PRODUCTS.find((product) => product.productId === productId);
}

export function isValidProductId(productId: string): boolean {
  return PRODUCTS.some((product) => product.productId === productId);
}

export function getPrice(productId: string): number {
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }
  return product.priceUsd;
}

export function supportsBTCPay(productId: string): boolean {
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }
  return product.btcpayEnabled;
}

export function isRecurring(productId: string): boolean {
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }
  return product.isRecurring;
}

export function getProductsByType(type: ProductConfig['type']): ProductConfig[] {
  return PRODUCTS.filter((product) => product.type === type);
}

export function calculateExpiration(productId: string): Date | null {
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }

  if (!product.durationHours) {
    return null;
  }

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + product.durationHours);
  return expiration;
}

export function isFreeDemo(demoId: string): boolean {
  return FREE_DEMOS.includes(demoId);
}
