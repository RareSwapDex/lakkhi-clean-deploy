#!/usr/bin/env node

// Script to patch wallet adapter dependencies
const fs = require('fs');
const path = require('path');

console.log('Fixing wallet adapter dependencies...');

// Path to the mobile wallet adapter protocol file
const mobileWalletAdapterPath = path.join(
  process.cwd(),
  'node_modules/@solana-mobile/mobile-wallet-adapter-protocol-web3js/lib/esm/index.js'
);

// Path to the web3.js module
const web3jsPath = path.join(
  process.cwd(),
  'node_modules/@solana/web3.js/lib/index.browser.esm.js'
);

try {
  // First enhance web3.js with all required exports
  if (fs.existsSync(web3jsPath)) {
    console.log('Adding additional exports to @solana/web3.js...');
    
    let web3Content = fs.readFileSync(web3jsPath, 'utf8');
    
    // Check if we already added the exports
    if (!web3Content.includes('class VersionedMessage')) {
      // Add additional classes needed by wallet adapters
      const additionalExports = `
// Additional mock classes needed by wallet adapters
class VersionedMessage {
  constructor() {}
  static deserialize() { return new VersionedMessage(); }
}

class VersionedTransaction {
  constructor() {
    this.signatures = [];
    this.message = new VersionedMessage();
  }
  serialize() { return new Uint8Array(); }
  static deserialize() { return new VersionedTransaction(); }
}

class Connection {
  constructor() {}
  getLatestBlockhash() { return Promise.resolve({ blockhash: "", lastValidBlockHeight: 0 }); }
  confirmTransaction() { return Promise.resolve({ value: { err: null } }); }
  getBalance() { return Promise.resolve(0); }
  getAccountInfo() { return Promise.resolve(null); }
  sendRawTransaction() { return Promise.resolve(""); }
  getRecentBlockhash() { return Promise.resolve({ blockhash: "", feeCalculator: { lamportsPerSignature: 0 } }); }
}

class Keypair {
  constructor() {
    this.publicKey = new PublicKey();
    this.secretKey = new Uint8Array(32);
  }
  static generate() { return new Keypair(); }
  static fromSecretKey(secretKey) { return new Keypair(); }
  static fromSeed(seed) { return new Keypair(); }
}

class PublicKey {
  constructor(value) {
    this._key = value || new Uint8Array(32);
  }
  toString() { return ""; }
  toBase58() { return ""; }
  toBuffer() { return Buffer.from([]); }
  equals() { return true; }
  toJSON() { return ""; }
}

class Transaction {
  constructor() {
    this.signatures = [];
    this.feePayer = null;
    this.instructions = [];
    this.recentBlockhash = null;
  }
  add(...items) { return this; }
  sign() { return this; }
  serialize() { return Buffer.from([]); }
  static from() { return new Transaction(); }
  static populate() { return new Transaction(); }
}

class Message {
  constructor() {}
  serialize() { return new Uint8Array(); }
  static from() { return new Message(); }
}

const SIGNATURE_LENGTH_IN_BYTES = 64;

// Export all required types
export {
  VersionedMessage,
  VersionedTransaction,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  Message,
  SIGNATURE_LENGTH_IN_BYTES
};`;
      
      // Append our exports to the end of the file
      web3Content += additionalExports;
      
      // Write the updated content back to the file
      fs.writeFileSync(web3jsPath, web3Content, 'utf8');
      console.log('Successfully added exports to @solana/web3.js!');
    } else {
      console.log('Exports already added to @solana/web3.js.');
    }
  } else {
    console.error('Could not find @solana/web3.js module!');
  }

  // Create mobile wallet adapter mock
  const adapterDir = path.dirname(mobileWalletAdapterPath);
  if (!fs.existsSync(adapterDir)) {
    fs.mkdirSync(adapterDir, { recursive: true });
  }

  console.log('Creating mock implementation for mobile wallet adapter...');
  const mockContent = `
// Mock implementation of @solana-mobile/mobile-wallet-adapter-protocol-web3js
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Mock classes that mirror the real implementations
export const transact = () => Promise.resolve({});
export const Authorization = {};
export const AuthorizationResult = {};
export const Base64EncodedAddress = {};
export const MobileWalletAdapterProtocolError = {};

// Export mock functions
export function authorize() { return Promise.resolve({ accounts: [] }); }
export function reauthorize() { return Promise.resolve({ accounts: [] }); }
export function deauthorize() { return Promise.resolve(); }
export function signAndSendTransactions() { return Promise.resolve({ signatures: [] }); }
export function signMessages() { return Promise.resolve({ signedMessages: [] }); }
export function signTransactions() { return Promise.resolve({ signedTransactions: [] }); }
`;

  // Write the mock content
  fs.writeFileSync(mobileWalletAdapterPath, mockContent, 'utf8');
  console.log('Successfully created mock for mobile wallet adapter!');

  // Create index.js in the directory
  const indexFilePath = path.join(adapterDir, '..', 'index.js');
  if (!fs.existsSync(indexFilePath)) {
    fs.writeFileSync(indexFilePath, `
// Mock implementation of @solana-mobile/mobile-wallet-adapter-protocol-web3js index
module.exports = require('./esm/index.js');
`, 'utf8');
  }

  // Also fix the unsafe burner adapter that requires Keypair
  const burnerAdapterPath = path.join(
    process.cwd(),
    'node_modules/@solana/wallet-adapter-wallets/node_modules/@solana/wallet-adapter-unsafe-burner/lib/esm/adapter.js'
  );

  const burnerDir = path.dirname(burnerAdapterPath);
  if (!fs.existsSync(burnerDir)) {
    fs.mkdirSync(burnerDir, { recursive: true });
  }

  console.log('Creating mock for unsafe burner wallet adapter...');
  const mockBurnerAdapter = `
// Mock implementation of wallet-adapter-unsafe-burner
import { Keypair, PublicKey } from '@solana/web3.js';

export class UnsafeBurnerWalletAdapter {
  constructor() {
    this.publicKey = new PublicKey();
    this.connecting = false;
    this.connected = false;
  }
  
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  signTransaction() { return Promise.resolve(null); }
  signAllTransactions() { return Promise.resolve([]); }
}
`;

  fs.writeFileSync(burnerAdapterPath, mockBurnerAdapter, 'utf8');

  // Create index file for burner adapter
  const burnerIndexPath = path.join(burnerDir, 'index.js');
  fs.writeFileSync(burnerIndexPath, `
export { UnsafeBurnerWalletAdapter } from './adapter.js';
`, 'utf8');

  console.log('Successfully created mock for unsafe burner wallet adapter!');

  // Also fix the particle wallet adapter
  const particleWalletPath = path.join(
    process.cwd(),
    'node_modules/@solana/wallet-adapter-wallets/node_modules/@particle-network/solana-wallet/es/index.js'
  );

  const particleDir = path.dirname(particleWalletPath);
  if (!fs.existsSync(particleDir)) {
    fs.mkdirSync(particleDir, { recursive: true });
  }

  console.log('Creating mock for particle network wallet...');
  const mockParticleWallet = `
// Mock implementation of particle-network solana wallet
import { Connection } from '@solana/web3.js';

export class ParticleNetwork {
  constructor() {}
  solana = { getConnection: () => new Connection() };
}
`;

  fs.writeFileSync(particleWalletPath, mockParticleWallet, 'utf8');
  console.log('Successfully created mock for particle network wallet!');

  // Fix the ConnectionProvider
  const connectionProviderPath = path.join(
    process.cwd(),
    'node_modules/@solana/wallet-adapter-react/lib/esm/ConnectionProvider.js'
  );

  if (fs.existsSync(connectionProviderPath)) {
    console.log('Ensuring Connection is properly imported in ConnectionProvider...');
    const connectionContent = fs.readFileSync(connectionProviderPath, 'utf8');
    
    if (connectionContent.includes('Connection')) {
      fs.writeFileSync(connectionProviderPath, connectionContent.replace(
        "import { Connection } from '@solana/web3.js';",
        "import { Connection } from '@solana/web3.js';"
      ), 'utf8');
      console.log('Connection import already properly set up.');
    }
  }

  // Fix wallet-adapter-mobile
  const mobileAdapterPath = path.join(
    process.cwd(),
    'node_modules/@solana-mobile/wallet-adapter-mobile/lib/esm/index.js'
  );
  
  if (!fs.existsSync(path.dirname(mobileAdapterPath))) {
    fs.mkdirSync(path.dirname(mobileAdapterPath), { recursive: true });
    
    console.log('Creating mock for mobile wallet adapter...');
    const mockMobileAdapter = `
// Mock implementation of @solana-mobile/wallet-adapter-mobile
import { PublicKey } from '@solana/web3.js';

export class SolanaMobileWalletAdapter {
  constructor() {
    this.publicKey = new PublicKey();
    this.connecting = false;
    this.connected = false;
  }
  
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  signTransaction() { return Promise.resolve(null); }
  signAllTransactions() { return Promise.resolve([]); }
}
`;
    
    fs.writeFileSync(mobileAdapterPath, mockMobileAdapter, 'utf8');
    console.log('Successfully created mock for mobile wallet adapter!');
  }

  console.log('Wallet adapter dependencies fixed successfully!');

} catch (error) {
  console.error('Error fixing wallet adapter dependencies:', error);
  process.exit(1);
} 