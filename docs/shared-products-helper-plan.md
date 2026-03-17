# Shared Products Helper Plan

## Purpose

Prepare a shared helper compatibility layer before switching any live product consumer.

## Current live exports to mirror
- PRODUCTS
- getProduct
- isValidProductId
- getPrice
- supportsBTCPay
- isRecurring
- getProductsByType
- calculateExpiration
- FREE_DEMOS
- isFreeDemo

## Safe approach

Do not replace `api/config/products.ts` yet.

First:
1. create helper equivalents inside shared payments
2. keep them read-only and unused by live code at first
3. compare outputs with the live product config
4. migrate one low-risk consumer later

## Rule

No live import swaps until shared helper behavior is reviewed.
