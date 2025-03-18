import React from 'react';
import { Box, Container, Text, Flex, Link, Stack, Divider } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" bg="gray.50" py={10} mt={10}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Box mb={{ base: 6, md: 0 }}>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">Lakkhi Program</Text>
            <Text mt={2} color="gray.600">A decentralized crowdfunding platform on Solana</Text>
          </Box>
          
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            <Link href="/" color="gray.600" _hover={{ color: 'blue.500' }}>Home</Link>
            <Link href="/campaigns-v2" color="gray.600" _hover={{ color: 'blue.500' }}>Campaigns</Link>
            <Link href="/create-campaign-v2" color="gray.600" _hover={{ color: 'blue.500' }}>Create Campaign</Link>
          </Stack>
        </Flex>
        
        <Divider my={6} />
        
        <Text textAlign="center" color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} Lakkhi Program. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
} 