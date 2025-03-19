// Import polyfills first (must come before any other imports)
import '../polyfills';
// Import manual overrides for rpc-websockets
import '../polyfills/rpc-websockets-overrides';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f2ff',
      100: '#cce5ff',
      200: '#99cbff',
      300: '#66b2ff',
      400: '#3399ff',
      500: '#007fff',
      600: '#0066cc',
      700: '#004c99',
      800: '#003366',
      900: '#001933',
    },
  },
  fonts: {
    heading: '"Segoe UI", sans-serif',
    body: '"Segoe UI", sans-serif',
  },
});

function MyApp({ Component, pageProps }) {
  // Set up network and endpoint
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Set up wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp; 