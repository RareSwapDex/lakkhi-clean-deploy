#!/usr/bin/env node

// This is a simplified patch script that directly patches the problematic imports
const fs = require('fs');
const path = require('path');

console.log('Applying custom patches for @solana/web3.js...');

// Path to the file we want to patch
const targetFile = path.join(
  process.cwd(),
  'node_modules/@solana/web3.js/lib/index.browser.esm.js'
);

try {
  // Check if file exists
  if (!fs.existsSync(targetFile)) {
    console.error(`Target file not found: ${targetFile}`);
    process.exit(0); // Not a failure, might be running in a different environment
  }

  // Read the file content
  let content = fs.readFileSync(targetFile, 'utf8');

  // Check if the file already contains our patch
  if (content.includes('// PATCH: Mock implementation')) {
    console.log('Patch already applied.');
    process.exit(0);
  }

  // Replace the problematic imports with our mocks
  content = content.replace(
    `import {Client as RpcWebSocketClient} from 'rpc-websockets/dist/lib/client';
import RpcWebSocketClient$1 from 'rpc-websockets/dist/lib/client/websocket.browser';`,
    `// PATCH: Mock implementation instead of real imports
// Mock for rpc-websockets/dist/lib/client
class RpcWebSocketClient {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

// Mock for rpc-websockets/dist/lib/client/websocket.browser
class RpcWebSocketClient$1 {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

// End of PATCH`
  );

  // Write the patched content back to the file
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully applied patch to @solana/web3.js!');
} catch (error) {
  console.error('Error applying patch:', error);
  process.exit(1);
} 