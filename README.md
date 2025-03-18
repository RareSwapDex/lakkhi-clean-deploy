# Lakkhi Program V2

A decentralized crowdfunding platform built on Solana

## Overview

Lakkhi Program is a crowdfunding platform that allows users to create and contribute to fundraising campaigns using Solana blockchain. This ensures transparency, security, and low transaction fees.

## Features

- Create fundraising campaigns with customizable details
- Donate to campaigns using SOL
- Track fundraising progress in real-time
- Connect with popular Solana wallets
- Browse and search campaigns

## Tech Stack

- Next.js for the frontend
- Chakra UI for styling
- Solana wallet adapters for wallet integration
- Solana web3.js for blockchain interactions

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in Vercel:
   - `NEXT_PUBLIC_SOLANA_NETWORK`: `devnet` or `mainnet`
   - `NEXT_PUBLIC_RPC_URL`: URL of your Solana RPC endpoint

## License

MIT 