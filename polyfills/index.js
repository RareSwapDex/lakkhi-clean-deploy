// This file initializes all the necessary browser polyfills
import { Buffer } from 'buffer';
import process from 'process';

// Make polyfills available globally
if (typeof window !== 'undefined') {
  // Buffer polyfill - critical for Solana
  window.Buffer = window.Buffer || Buffer;
  
  // Process polyfill - needed for various node-specific code
  window.process = window.process || process;
  
  // Helpful debugging message
  console.debug('Browser polyfills initialized');
} 