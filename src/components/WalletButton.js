import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box, Button, Text } from "@chakra-ui/react";

export default function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <Box>
      {connected ? (
        <Box display="flex" alignItems="center">
          <Text mr={2} fontSize="sm" color="gray.600">
            Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </Text>
          <WalletMultiButton />
        </Box>
      ) : (
        <WalletMultiButton />
      )}
    </Box>
  );
} 