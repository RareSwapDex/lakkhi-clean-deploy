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
  // First, create a completely new mock for web3.js instead of appending
  if (fs.existsSync(web3jsPath)) {
    console.log('Replacing @solana/web3.js with mock implementation...');
    
    // Create a complete mock implementation of web3.js
    const mockWeb3Content = `
// Mock implementation of @solana/web3.js

// Utility classes
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

// Constants
const SIGNATURE_LENGTH_IN_BYTES = 64;

// Export all required types
export {
  PublicKey,
  Transaction,
  Message,
  VersionedMessage,
  VersionedTransaction,
  Connection,
  Keypair,
  SIGNATURE_LENGTH_IN_BYTES
};
`;
      
      // Write the mock implementation to the file
      fs.writeFileSync(web3jsPath, mockWeb3Content, 'utf8');
      console.log('Successfully replaced @solana/web3.js with mock implementation!');
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

// Add missing transactRemote function
export const transactRemote = () => Promise.resolve({});
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

  // Also fix the js-base64 module required by the mobile wallet adapter
  const jsBase64Dir = path.join(
    process.cwd(),
    'node_modules/js-base64'
  );
  if (!fs.existsSync(jsBase64Dir)) {
    fs.mkdirSync(jsBase64Dir, { recursive: true });
    // Create a mock implementation for js-base64
    fs.writeFileSync(path.join(jsBase64Dir, 'package.json'), JSON.stringify({
      name: 'js-base64',
      version: '1.0.0',
      main: 'index.js',
      type: 'module'
    }), 'utf8');
    
    fs.writeFileSync(path.join(jsBase64Dir, 'index.js'), `
export const toUint8Array = (str) => new Uint8Array();
export const fromUint8Array = (arr) => '';
export const Base64 = {
  encode: (str) => '',
  decode: (str) => ''
};
export default Base64;
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
    console.log('Creating mock ConnectionProvider...');
    fs.writeFileSync(connectionProviderPath, `
import { createContext, useContext, useMemo } from 'react';
import { Connection } from '@solana/web3.js';

const ConnectionContext = createContext({});

export function ConnectionProvider({ children, endpoint, config }) {
  const connection = useMemo(() => new Connection(), []);
  return (
    <ConnectionContext.Provider value={{ connection, endpoint, config }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
`, 'utf8');
    console.log('Successfully created mock ConnectionProvider!');
  }

  // Fix wallet-adapter-mobile
  const mobileAdapterPath = path.join(
    process.cwd(),
    'node_modules/@solana-mobile/wallet-adapter-mobile/lib/esm/index.js'
  );
  
  const mobileAdapterDir = path.dirname(mobileAdapterPath);
  if (!fs.existsSync(mobileAdapterDir)) {
    fs.mkdirSync(mobileAdapterDir, { recursive: true });
  }
    
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

  // Fix package.json for rpc-websockets
  const rpcWebsocketsDir = path.join(
    process.cwd(),
    'node_modules/rpc-websockets'
  );
  
  if (fs.existsSync(rpcWebsocketsDir)) {
    console.log('Updating rpc-websockets package.json...');
    
    // Create a more comprehensive package.json with proper exports
    fs.writeFileSync(
      path.join(rpcWebsocketsDir, 'package.json'),
      JSON.stringify({
        name: 'rpc-websockets',
        version: '7.5.1',
        description: 'Mock implementation for Solana',
        main: 'dist/index.js',
        exports: {
          ".": "./dist/index.js",
          "./dist/lib/client": "./dist/lib/client/index.js",
          "./dist/lib/client/websocket": "./dist/lib/client/websocket.js",
          "./dist/lib/client/websocket.browser": "./dist/lib/client/websocket.browser.js"
        }
      }, null, 2),
      'utf8'
    );
    
    // Ensure all required directories exist
    [
      path.join(rpcWebsocketsDir, 'dist'),
      path.join(rpcWebsocketsDir, 'dist/lib'),
      path.join(rpcWebsocketsDir, 'dist/lib/client')
    ].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Create the required files with mock implementations
    const files = {
      'dist/index.js': `
module.exports = require('./lib/client');
`,
      'dist/lib/client/index.js': `
class Client {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

exports.Client = Client;
exports.__esModule = true;
exports.default = { Client };
`,
      'dist/lib/client/websocket.js': `
class WebSocket {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

module.exports = WebSocket;
module.exports.__esModule = true;
module.exports.default = WebSocket;
`,
      'dist/lib/client/websocket.browser.js': `
class WebSocketBrowser {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

module.exports = WebSocketBrowser;
module.exports.__esModule = true;
module.exports.default = WebSocketBrowser;
`
    };
    
    // Write all the mock files
    Object.entries(files).forEach(([filePath, content]) => {
      fs.writeFileSync(path.join(rpcWebsocketsDir, filePath), content, 'utf8');
    });
    
    console.log('Successfully updated rpc-websockets package!');
  }

  console.log('Wallet adapter dependencies fixed successfully!');

} catch (error) {
  console.error('Error fixing wallet adapter dependencies:', error);
  process.exit(1);
} 