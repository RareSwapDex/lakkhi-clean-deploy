/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle the fallbacks for all environments
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

    // Use a more direct approach to solve the rpc-websockets issue
    config.resolve.alias = {
      ...config.resolve.alias,
      'rpc-websockets': path.resolve(__dirname, 'polyfills/rpc-websockets-mock.js'),
    };

    return config;
  },
};

module.exports = nextConfig; 