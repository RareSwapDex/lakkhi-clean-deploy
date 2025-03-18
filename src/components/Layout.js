import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1" py={8}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
} 