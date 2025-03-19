#!/usr/bin/env node

// Script to manually add missing exports to @solana/web3.js
const fs = require('fs');
const path = require('path');

console.log('Fixing @solana/web3.js exports...');

// Path to the file we want to patch
const targetFile = path.join(
  process.cwd(),
  'node_modules/@solana/web3.js/lib/index.browser.esm.js'
);

try {
  // Check if file exists
  if (!fs.existsSync(targetFile)) {
    console.error(`Target file not found: ${targetFile}`);
    process.exit(1);
  }

  // Read the file content
  let content = fs.readFileSync(targetFile, 'utf8');

  // Check if our exports are already present
  if (content.includes('export { PublicKey, Transaction, Message')) {
    console.log('Exports already fixed.');
    process.exit(0);
  }

  // Add additional mocks that are needed
  const additionalMocks = `
// Additional mock classes needed by wallet adapters
class VersionedMessage {
  constructor() {}
  static deserialize() { return new VersionedMessage(); }
}

class VersionedTransaction {
  constructor() {}
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
}

class Keypair {
  constructor() {
    this.publicKey = new PublicKey();
    this.secretKey = new Uint8Array();
  }
  static generate() { return new Keypair(); }
  static fromSecretKey() { return new Keypair(); }
}
`;

  // Find the position to add our mocks - before the end of the file
  const appendPosition = content.length;
  
  // Add our mocks and export them
  const exportCode = `
${additionalMocks}
// Export our mock implementations
export { 
  PublicKey, 
  Transaction, 
  Message, 
  SIGNATURE_LENGTH_IN_BYTES,
  VersionedMessage,
  VersionedTransaction,
  Connection,
  Keypair
};
`;

  // Append the exports to the end of the file
  content = content.slice(0, appendPosition) + exportCode;

  // Write the updated content back to the file
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully fixed @solana/web3.js exports!');
} catch (error) {
  console.error('Error fixing exports:', error);
  process.exit(1);
} 