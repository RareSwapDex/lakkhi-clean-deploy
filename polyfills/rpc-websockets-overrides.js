// Manual override for rpc-websockets
// This creates a global mock that can be used if our node_modules approach fails

// Simple client mock
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

// Browser-specific class
class WebSocketBrowser extends Client {}

// Define a global namespace for our mocks if we're in the browser
if (typeof window !== 'undefined') {
  // Create a global namespace for our mocks
  window.__RPC_WEBSOCKETS_MOCK__ = {
    Client,
    WebSocketBrowser
  };
  
  // Try to patch the module system if we're using webpack
  if (typeof __webpack_require__ !== 'undefined') {
    try {
      // This is a last-resort manual override attempt
      const moduleCache = __webpack_require__.c;
      
      Object.keys(moduleCache).forEach(moduleId => {
        const module = moduleCache[moduleId];
        
        // If this is the rpc-websockets module or any of its subpaths
        if (
          moduleId.includes('rpc-websockets') || 
          (module.exports && module.exports.__esModule && 
            (moduleId.includes('client') || moduleId.includes('websocket')))
        ) {
          // Override the exports
          module.exports = {
            Client: Client,
            default: { Client },
            __esModule: true
          };
          
          // For websocket browser specific path
          if (moduleId.includes('websocket.browser')) {
            module.exports = WebSocketBrowser;
            module.exports.default = WebSocketBrowser;
          }
        }
      });
      
      console.debug('Manual module overrides applied for rpc-websockets');
    } catch (err) {
      console.warn('Could not apply manual module overrides', err);
    }
  }
} 