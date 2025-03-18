import React from 'react';
import { Box, Container, Heading, Text, Button, Center } from '@chakra-ui/react';
import Link from 'next/link';
import Layout from '../src/components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Container maxW="container.xl">
        <Center py={20}>
          <Box textAlign="center">
            <Heading 
              as="h1" 
              size="4xl" 
              color="blue.500" 
              mb={6}
            >
              404
            </Heading>
            <Heading mb={4}>Page Not Found</Heading>
            <Text fontSize="lg" mb={8}>
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </Text>
            <Link href="/" passHref>
              <Button as="a" colorScheme="blue" size="lg">
                Return to Homepage
              </Button>
            </Link>
          </Box>
        </Center>
      </Container>
    </Layout>
  );
} 