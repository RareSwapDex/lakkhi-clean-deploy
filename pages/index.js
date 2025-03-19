import React from 'react';
import { Box, Container, Heading, Text, Stack, Grid, Button, Flex, Icon } from '@chakra-ui/react';
import Layout from '../src/components/Layout';
import CampaignCard from '../src/components/CampaignCard';
import { getCampaigns } from '../src/utils/campaignData';
import Link from 'next/link';

export default function Home({ featuredCampaigns }) {
  return (
    <Layout>
      <Box bg="blue.500" color="white" py={16} mb={8}>
        <Container maxW="container.xl">
          <Stack spacing={6} textAlign={{ base: 'center', md: 'left' }}>
            <Heading as="h1" size="2xl">
              Decentralized Donation Platform on Solana
            </Heading>
            <Text fontSize="xl" maxW="800px">
              Lakkhi Program is a decentralized donation platform built on Solana, 
              enabling transparent and low-cost fundraising for projects that matter.
            </Text>
            <Flex 
              direction={{ base: 'column', md: 'row' }} 
              spacing={4} 
              gap={4}
              mt={4}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <Link href="/campaigns-v2" passHref>
                <Button as="a" size="lg" colorScheme="white" variant="outline" _hover={{ bg: 'whiteAlpha.200' }}>
                  Explore Campaigns
                </Button>
              </Link>
              <Link href="/create-campaign-v2" passHref>
                <Button as="a" size="lg" bg="white" color="blue.500" _hover={{ bg: 'gray.100' }}>
                  Start a Campaign
                </Button>
              </Link>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <Stack spacing={12}>
          <Stack spacing={4}>
            <Heading as="h2" size="xl">
              Featured Campaigns
            </Heading>
            <Text color="gray.600">
              Discover and support these innovative campaigns
            </Text>
            
            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} 
              gap={6}
              mt={4}
            >
              {featuredCampaigns.map(campaign => (
                <CampaignCard key={campaign.pubkey} campaign={campaign} />
              ))}
            </Grid>
            
            <Box textAlign="center" mt={8}>
              <Link href="/campaigns-v2" passHref>
                <Button as="a" size="lg" colorScheme="blue" variant="outline">
                  View All Campaigns
                </Button>
              </Link>
            </Box>
          </Stack>

          <Stack spacing={6}>
            <Heading as="h2" size="xl">
              Why Lakkhi Program?
            </Heading>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                <Heading as="h3" size="md" mb={4}>Fast & Low Cost</Heading>
                <Text>Powered by Solana blockchain, transactions are near-instant with minimal fees.</Text>
              </Box>
              
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                <Heading as="h3" size="md" mb={4}>Transparent</Heading>
                <Text>All transactions are recorded on the blockchain, ensuring full visibility and trust.</Text>
              </Box>
              
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                <Heading as="h3" size="md" mb={4}>Decentralized</Heading>
                <Text>No middlemen - funds go directly from supporters to project creators.</Text>
              </Box>
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  // Fetch campaigns (in a real app, this would be from blockchain or API)
  const allCampaigns = await getCampaigns();
  
  // Get 3 campaigns as featured
  const featuredCampaigns = allCampaigns.slice(0, 3);
  
  return {
    props: {
      featuredCampaigns,
    },
    // Revalidate every hour
    revalidate: 3600,
  };
} 