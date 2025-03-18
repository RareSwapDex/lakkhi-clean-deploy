import React from 'react';
import { Box, Heading, Text, Button, Progress, Stack, Badge, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CampaignCard({ campaign }) {
  // Default campaign if none provided
  const defaultCampaign = {
    name: "Sample Campaign",
    description: "This is a sample campaign for testing.",
    target: 5000,
    deadline: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    amountRaised: 2000,
    pubkey: "sample-campaign-123",
    createdAt: new Date().getTime()
  };

  const c = campaign || defaultCampaign;
  
  // Calculate progress
  const progress = Math.min(Math.round((c.amountRaised / c.target) * 100), 100);
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={4}
      boxShadow="md"
      bg="white"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "lg"
      }}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading as="h3" size="md" color="blue.600">{c.name}</Heading>
        <Badge colorScheme={progress >= 100 ? "green" : "blue"}>
          {progress >= 100 ? "Funded" : "Active"}
        </Badge>
      </Flex>
      
      <Text noOfLines={2} color="gray.600" mb={4}>
        {c.description}
      </Text>
      
      <Stack spacing={2} mb={4}>
        <Flex justify="space-between">
          <Text fontWeight="bold">Progress:</Text>
          <Text>{progress}%</Text>
        </Flex>
        <Progress value={progress} colorScheme="blue" borderRadius="full" size="sm" />
        
        <Flex justify="space-between">
          <Text fontWeight="medium">Raised:</Text>
          <Text>{c.amountRaised} SOL</Text>
        </Flex>
        
        <Flex justify="space-between">
          <Text fontWeight="medium">Goal:</Text>
          <Text>{c.target} SOL</Text>
        </Flex>
        
        <Flex justify="space-between">
          <Text fontWeight="medium">Deadline:</Text>
          <Text>{format(new Date(c.deadline), 'MMM dd, yyyy')}</Text>
        </Flex>
      </Stack>
      
      <Link href={`/campaigns-v2/${c.pubkey}`} passHref>
        <Button as="a" colorScheme="blue" width="full">
          View Details
        </Button>
      </Link>
    </Box>
  );
} 