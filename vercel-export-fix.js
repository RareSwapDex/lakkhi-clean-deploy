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

  // Find the position to add our exports - at the end of the file
  const appendPosition = content.length;
  const exportCode = `

// Export our mock implementations
export { PublicKey, Transaction, Message, SIGNATURE_LENGTH_IN_BYTES };
`;

  // Append the exports to the end of the file
  content = content.slice(0, appendPosition) + exportCode + content.slice(appendPosition);

  // Write the updated content back to the file
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully fixed @solana/web3.js exports!');
} catch (error) {
  console.error('Error fixing exports:', error);
  process.exit(1);
} 