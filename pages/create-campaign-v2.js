import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  Stack,
  InputGroup,
  InputRightAddon,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import Layout from '../src/components/Layout';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CreateCampaign() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target: '',
    deadline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Get min date (today) for deadline picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate wallet connection
    if (!connected) {
      setError('Please connect your wallet to create a campaign');
      return;
    }
    
    // Validate form fields
    if (!formData.name.trim()) {
      setError('Campaign name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Campaign description is required');
      return;
    }
    
    if (!formData.target || parseFloat(formData.target) <= 0) {
      setError('Please enter a valid target amount');
      return;
    }
    
    if (!formData.deadline) {
      setError('Campaign deadline is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, this would call a function to create an on-chain campaign
      // Instead we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful campaign creation
      const campaignId = `campaign-${Date.now()}`;
      
      // Redirect to the new campaign
      router.push(`/campaigns-v2/${campaignId}`);
    } catch (error) {
      console.error('Campaign creation error:', error);
      setError('There was an error creating your campaign. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <Container maxW="container.md" py={8}>
        <Stack spacing={8}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Create Campaign
            </Heading>
            <Text color="gray.600">
              Launch your fundraising campaign on the Solana blockchain
            </Text>
          </Box>
          
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <CloseButton 
                position="absolute" 
                right="8px" 
                top="8px" 
                onClick={() => setError('')}
              />
            </Alert>
          )}
          
          {!connected && (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle mr={2}>Wallet Required!</AlertTitle>
              <AlertDescription>Connect your wallet to create a campaign</AlertDescription>
            </Alert>
          )}
          
          <Box 
            as="form" 
            onSubmit={handleSubmit}
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            p={8}
          >
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Give your campaign a catchy name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your campaign in detail"
                  minH="200px"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Funding Target</FormLabel>
                <InputGroup>
                  <Input 
                    name="target"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.target}
                    onChange={handleChange}
                    placeholder="How much do you want to raise?"
                  />
                  <InputRightAddon>SOL</InputRightAddon>
                </InputGroup>
                <FormHelperText>
                  Enter the amount of SOL you need to raise
                </FormHelperText>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Campaign Deadline</FormLabel>
                <Input 
                  name="deadline"
                  type="date"
                  min={getMinDate()}
                  value={formData.deadline}
                  onChange={handleChange}
                />
                <FormHelperText>
                  Set the end date for your fundraising campaign
                </FormHelperText>
              </FormControl>
              
              <Button 
                mt={6}
                colorScheme="blue" 
                size="lg" 
                type="submit"
                isLoading={isSubmitting}
                loadingText="Creating Campaign"
                isDisabled={!connected}
              >
                Create Campaign
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
} 