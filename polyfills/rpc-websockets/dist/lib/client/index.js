// Mock implementation for rpc-websockets client
class Client {
  constructor() {
    this.on = () => {};
    this.call = () => Promise.resolve(null);
    this.close = () => {};
  }
}

module.exports = { Client }; 