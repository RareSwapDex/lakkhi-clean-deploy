// This file initializes all the necessary browser polyfills
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Export the polyfills for direct import
export { Buffer }; 