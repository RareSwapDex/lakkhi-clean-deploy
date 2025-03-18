import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Progress, 
  Stack, 
  Flex, 
  Grid, 
  Divider,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { format } from 'date-fns';
import Layout from '../../src/components/Layout';
import { getCampaign, getCampaigns } from '../../src/utils/campaignData';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CampaignDetail({ campaign }) {
  const router = useRouter();
  const [donationAmount, setDonationAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connected } = useWallet();
  
  // For success dialog after donation
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const cancelRef = React.useRef();
  
  // Handle loading/404 state
  if (router.isFallback) {
    return (
      <Layout>
        <Container maxW="container.xl" textAlign="center" py={20}>
          <Text fontSize="xl">Loading campaign details...</Text>
        </Container>
      </Layout>
    );
  }
  
  if (!campaign) {
    return (
      <Layout>
        <Container maxW="container.xl" textAlign="center" py={20}>
          <Heading mb={4}>Campaign Not Found</Heading>
          <Text mb={8}>The campaign you're looking for doesn't exist or has been removed.</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => router.push('/campaigns-v2')}
          >
            Back to Campaigns
          </Button>
        </Container>
      </Layout>
    );
  }
  
  // Calculate progress
  const progress = Math.min(Math.round((campaign.amountRaised / campaign.target) * 100), 100);
  
  // Calculate days left
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24)));
  
  // Handle donation submission
  const handleDonate = async () => {
    if (!connected) {
      alert("Please connect your wallet to donate");
      return;
    }
    
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call a function to create a Solana transaction
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction
      
      onClose();
      setIsSuccessOpen(true);
      setDonationAmount('');
    } catch (error) {
      console.error('Donation error:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          {/* Campaign Header */}
          <Box>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Box>
                <Heading as="h1" size="xl" mb={2}>
                  {campaign.name}
                </Heading>
                <Badge colorScheme={progress >= 100 ? "green" : "blue"} fontSize="md" px={2} py={1}>
                  {progress >= 100 ? "Funded" : "Active"}
                </Badge>
              </Box>
              
              <Button 
                colorScheme="blue" 
                size="lg"
                onClick={onOpen}
              >
                Donate Now
              </Button>
            </Flex>
          </Box>
          
          {/* Campaign Content */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Main Content */}
            <Box>
              <Box mb={8}>
                <Text fontSize="lg" whiteSpace="pre-line">
                  {campaign.description}
                </Text>
              </Box>
              
              <Divider my={8} />
              
              <Box>
                <Heading as="h3" size="md" mb={4}>
                  Campaign Details
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <Stat>
                    <StatLabel>Created On</StatLabel>
                    <StatNumber>{format(new Date(campaign.createdAt), 'MMMM d, yyyy')}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Deadline</StatLabel>
                    <StatNumber>{format(new Date(campaign.deadline), 'MMMM d, yyyy')}</StatNumber>
                    <StatHelpText>{daysLeft} days left</StatHelpText>
                  </Stat>
                </Grid>
              </Box>
            </Box>
            
            {/* Sidebar */}
            <Box>
              <Box 
                borderWidth="1px" 
                borderRadius="lg" 
                p={6}
                bg="white"
                boxShadow="md"
              >
                <Stack spacing={5}>
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text fontWeight="bold">Progress:</Text>
                      <Text>{progress}%</Text>
                    </Flex>
                    <Progress value={progress} colorScheme="blue" borderRadius="full" size="md" />
                  </Box>
                  
                  <Stat>
                    <StatLabel>Raised</StatLabel>
                    <StatNumber>{campaign.amountRaised} SOL</StatNumber>
                    <StatHelpText>of {campaign.target} SOL goal</StatHelpText>
                  </Stat>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Time Remaining:</Text>
                    <Text fontSize="lg">{daysLeft} days left</Text>
                  </Box>
                  
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    w="full"
                    onClick={onOpen}
                  >
                    Donate Now
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Stack>
      </Container>
      
      {/* Donation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donate to {campaign.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Donation Amount</FormLabel>
              <InputGroup>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
                <InputRightAddon>SOL</InputRightAddon>
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button 
              colorScheme="blue" 
              onClick={handleDonate} 
              isLoading={isLoading}
              isDisabled={!connected || !donationAmount || parseFloat(donationAmount) <= 0}
            >
              Donate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Success Dialog */}
      <AlertDialog
        isOpen={isSuccessOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsSuccessOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Donation Successful!
            </AlertDialogHeader>
            <AlertDialogBody>
              Thank you for your donation of {donationAmount} SOL to {campaign.name}. Your contribution helps make this project possible!
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsSuccessOpen(false)}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
}

export async function getStaticPaths() {
  const campaigns = await getCampaigns();
  
  const paths = campaigns.map(campaign => ({
    params: { id: campaign.pubkey }
  }));
  
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const campaign = await getCampaign(params.id);
  
  // If campaign not found, return 404
  if (!campaign) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      campaign
    },
    // Revalidate every hour
    revalidate: 3600,
  };
} 