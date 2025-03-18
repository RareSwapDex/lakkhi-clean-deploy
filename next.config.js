/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // This is only needed for the client-side build
    if (!isServer) {
      // Polyfills for Node.js modules
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert'),
      };

      // Add our custom polyfills
      config.resolve.alias = {
        ...config.resolve.alias,
        'rpc-websockets/dist/lib/client': path.resolve(__dirname, 'polyfills/rpc-websockets/dist/lib/client'),
        'rpc-websockets/dist/lib/client/websocket.browser': path.resolve(__dirname, 'polyfills/rpc-websockets/dist/lib/client/websocket.browser'),
      };
    }

    return config;
  },
};

module.exports = nextConfig; 