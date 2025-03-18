// Mock implementation for rpc-websockets websocket browser client
class WebSocketBrowser {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
  }
}

module.exports = WebSocketBrowser; 