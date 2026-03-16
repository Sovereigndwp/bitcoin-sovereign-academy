# Premium Routes Runtime Compatibility Notes

## Purpose

Make the shared premium routes logic available in a JS-compatible form before attempting any live import swap.

## Problem

The shared candidate was first created as:
- packages/shared-access/src/premium-routes.ts

But current live callers are JS runtime files such as:
- server-local.js
- middleware.js
- lib/premium-route-access.js

## Safe approach

Create a JS-compatible shared copy at:
- packages/shared-access/src/premium-routes.js

This allows future live import swaps to target a JS file first, without requiring immediate TypeScript runtime integration.

## Rule

Do not change live imports yet.
First confirm the shared JS copy matches the current live logic.
