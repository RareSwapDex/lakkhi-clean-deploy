// Simple WebSocket browser client mock for rpc-websockets
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

// Export the WebSocketBrowser class directly as the default export
// This matches the pattern expected by @solana/web3.js when importing from this path
module.exports = WebSocketBrowser; 