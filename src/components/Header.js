import React from 'react';
import { Box, Flex, Heading, Text, Spacer, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import WalletButton from './WalletButton';

const NavLink = ({ href, children }) => (
  <Link href={href} passHref>
    <ChakraLink 
      px={4} 
      py={2} 
      rounded="md" 
      _hover={{ textDecoration: 'none', bg: 'blue.50' }}
    >
      {children}
    </ChakraLink>
  </Link>
);

export default function Header() {
  return (
    <Box as="header" bg="white" boxShadow="md" position="sticky" top={0} zIndex={10}>
      <Flex align="center" p={4} maxW="container.xl" mx="auto">
        <Link href="/" passHref>
          <ChakraLink _hover={{ textDecoration: 'none' }}>
            <Heading as="h1" size="lg" color="blue.500">
              Lakkhi Program
            </Heading>
          </ChakraLink>
        </Link>
        
        <Spacer />
        
        <Flex align="center">
          <NavLink href="/campaigns">Campaigns</NavLink>
          <NavLink href="/campaigns-v2">Campaigns V2</NavLink>
          <NavLink href="/create-campaign-v2">Create Campaign</NavLink>
          <Box ml={4}>
            <WalletButton />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
} 