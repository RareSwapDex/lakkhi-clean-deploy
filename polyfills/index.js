// This file initializes all the necessary browser polyfills
import { Buffer } from 'buffer';
import process from 'process';

// Make polyfills available globally
if (typeof window !== 'undefined') {
  // Buffer polyfill
  window.Buffer = Buffer;
  
  // Process polyfill
  window.process = process;
  
  // Console message to confirm polyfills are loaded
  console.info('Browser polyfills initialized');
}

// Export the polyfills for direct import
export { Buffer, process }; 