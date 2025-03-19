// Utility function to get the RPC Websockets client
// This provides a fallback mechanism when the normal import fails

export function getClient() {
  // First, try to use the module directly (this should fail at build time but we try just in case)
  try {
    // Try normal import via webpack
    const rpcWebsockets = require('rpc-websockets');
    return rpcWebsockets.Client;
  } catch (err) {
    console.warn('Normal import of rpc-websockets failed, using fallback');
    
    // Try global fallback if we're in the browser
    if (typeof window !== 'undefined' && window.__RPC_WEBSOCKETS_MOCK__) {
      return window.__RPC_WEBSOCKETS_MOCK__.Client;
    }
    
    // Return a mock client as last resort
    return class MockClient {
      constructor() {
        this.on = () => {};
        this.call = () => Promise.resolve(null);
        this.close = () => {};
        this.login = () => Promise.resolve(true);
        this.subscribe = () => Promise.resolve(1);
        this.unsubscribe = () => Promise.resolve(true);
      }
    };
  }
}

export function getBrowserWebSocket() {
  try {
    // Try normal import (should fail at build time)
    const websocketBrowser = require('rpc-websockets/dist/lib/client/websocket.browser');
    return websocketBrowser;
  } catch (err) {
    console.warn('Normal import of websocket.browser failed, using fallback');
    
    // Try global fallback
    if (typeof window !== 'undefined' && window.__RPC_WEBSOCKETS_MOCK__) {
      return window.__RPC_WEBSOCKETS_MOCK__.WebSocketBrowser;
    }
    
    // Return a mock as last resort
    return class MockWebSocketBrowser {
      constructor() {
        this.on = () => {};
        this.call = () => Promise.resolve(null);
        this.close = () => {};
        this.login = () => Promise.resolve(true);
        this.subscribe = () => Promise.resolve(1);
        this.unsubscribe = () => Promise.resolve(true);
      }
    };
  }
} 