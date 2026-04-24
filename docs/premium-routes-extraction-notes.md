# Premium Routes Extraction Notes

## Purpose

Track the first safe shared-access extraction candidate.

## Candidate file

- lib/premium-routes.js

## Why this is the safest first candidate

This file appears to contain pure route classification logic without:
- database access
- cookie parsing
- session lookups
- payment provider logic

That makes it a better first extraction candidate than the larger premium route access files.

## Shared copy created at

- packages/shared-access/src/premium-routes.ts

## Current rule

Do not switch live imports yet.

First:
1. create the shared version
2. compare outputs if needed
3. verify naming and types
4. only later consider swapping the live file to use the shared version
