// Mock implementation for the entire rpc-websockets module
class WebSocketClient {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
    this.login = () => Promise.resolve(true);
    this.subscribe = () => Promise.resolve(1);
    this.unsubscribe = () => Promise.resolve(true);
  }
}

class Client extends WebSocketClient {}

// Create a dedicated browser WebSocket class
class WebSocketBrowser extends WebSocketClient {}

// Main module export
const mainExport = {
  // Main export
  Client,
  // Nested exports for specific paths
  dist: {
    lib: {
      client: {
        Client,
        // Export for websocket.browser
        websocket: {
          browser: WebSocketBrowser
        }
      }
    }
  }
};

// Export the main module
module.exports = mainExport;

// Create explicit exports for direct imports
module.exports.Client = Client;

// Make sure dist and all nested paths are properly defined
module.exports.dist = mainExport.dist;
module.exports.dist.lib = mainExport.dist.lib;
module.exports.dist.lib.client = mainExport.dist.lib.client;
module.exports.dist.lib.client.Client = Client;
module.exports.dist.lib.client.websocket = mainExport.dist.lib.client.websocket;
module.exports.dist.lib.client.websocket.browser = WebSocketBrowser; 