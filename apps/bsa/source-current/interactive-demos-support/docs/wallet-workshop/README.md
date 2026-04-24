# Wallet Workshop

Interactive educational tool for learning how Bitcoin wallets work from entropy to addresses.

## Files

- **index.html** - Main workshop interface (688 lines)
- **wallet-workshop.js** - Core workshop logic and demonstrations (72KB)
- **test-load.html** - Development test file for verifying wallet-workshop.js loads correctly

## Features

- Entropy generation and visualization
- Seed phrase creation (BIP39)
- Private/public key cryptography demonstrations
- Address derivation for multiple formats:
  - P2PKH (Legacy addresses starting with 1)
  - P2SH (Script addresses starting with 3)
  - Bech32 (SegWit addresses starting with bc1)
- Interactive visualizations of cryptographic processes

## Development

The `test-load.html` file is for development/testing purposes only. It verifies that the wallet-workshop.js module loads without errors and can be used to debug issues during development.

## Usage

Access the workshop at: `/interactive-demos/wallet-workshop/`

Difficulty: Advanced
Prerequisites: Understanding of Bitcoin basics and transaction fundamentals
