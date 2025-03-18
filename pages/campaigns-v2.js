import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Stack,
  Select,
  Flex
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Layout from '../src/components/Layout';
import CampaignCard from '../src/components/CampaignCard';
import { getCampaigns } from '../src/utils/campaignData';

export default function CampaignsPage({ initialCampaigns }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  // Filter campaigns based on search term
  const filteredCampaigns = initialCampaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort campaigns based on selected option
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'oldest':
        return a.createdAt - b.createdAt;
      case 'most-funded':
        return b.amountRaised - a.amountRaised;
      case 'least-funded':
        return a.amountRaised - b.amountRaised;
      case 'ending-soon':
        return a.deadline - b.deadline;
      default:
        return 0;
    }
  });
  
  return (
    <Layout>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Explore Campaigns
            </Heading>
            <Text color="gray.600">
              Discover and support innovative projects on Solana
            </Text>
          </Box>
          
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            gap={4}
            align="center"
          >
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search campaigns..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select 
              maxW={{ base: '100%', md: '200px' }}
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-funded">Most Funded</option>
              <option value="least-funded">Least Funded</option>
              <option value="ending-soon">Ending Soon</option>
            </Select>
          </Flex>
          
          {sortedCampaigns.length > 0 ? (
            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} 
              gap={6}
            >
              {sortedCampaigns.map(campaign => (
                <CampaignCard key={campaign.pubkey} campaign={campaign} />
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg">No campaigns found matching your search.</Text>
            </Box>
          )}
        </Stack>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const campaigns = await getCampaigns();
  
  return {
    props: {
      initialCampaigns: campaigns
    },
    // Revalidate every hour
    revalidate: 3600,
  };
} 