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

// Create complete exports matching the structure required by @solana/web3.js
module.exports = {
  // Main export
  Client,
  // Nested exports for specific paths
  dist: {
    lib: {
      client: {
        Client,
        // Export for websocket.browser
        websocket: {
          browser: WebSocketClient
        }
      }
    }
  }
};

// Create path-specific exports for direct imports
module.exports.Client = Client;
module.exports.dist = module.exports.dist;
module.exports.dist.lib = module.exports.dist.lib;
module.exports.dist.lib.client = module.exports.dist.lib.client;
module.exports.dist.lib.client.websocket = module.exports.dist.lib.client.websocket;
module.exports.dist.lib.client.websocket.browser = WebSocketClient; 