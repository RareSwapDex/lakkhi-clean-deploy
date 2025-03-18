// Sample campaign data for demonstration
export const sampleCampaigns = [
  {
    pubkey: "campaign-1",
    name: "Clean Energy Research",
    description: "Funding research into sustainable clean energy sources that can help combat climate change and reduce our dependence on fossil fuels.",
    target: 10000,
    amountRaised: 7500,
    deadline: new Date().getTime() + 15 * 24 * 60 * 60 * 1000,
    createdAt: new Date().getTime() - 15 * 24 * 60 * 60 * 1000,
    owner: "GZ8n8NQJ1Pn67ZSdFHUKZXvTXzKQscGdEiFguCGS53U9",
  },
  {
    pubkey: "campaign-2",
    name: "Ocean Cleanup Initiative",
    description: "Supporting efforts to remove plastic and other pollutants from our oceans to protect marine life and ecosystems.",
    target: 7500,
    amountRaised: 5200,
    deadline: new Date().getTime() + 20 * 24 * 60 * 60 * 1000,
    createdAt: new Date().getTime() - 10 * 24 * 60 * 60 * 1000,
    owner: "GZ8n8NQJ1Pn67ZSdFHUKZXvTXzKQscGdEiFguCGS53U9",
  },
  {
    pubkey: "campaign-3",
    name: "Affordable Housing Project",
    description: "Building affordable housing for low-income families and individuals in urban areas where housing costs have skyrocketed.",
    target: 15000,
    amountRaised: 12000,
    deadline: new Date().getTime() + 25 * 24 * 60 * 60 * 1000,
    createdAt: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    owner: "GZ8n8NQJ1Pn67ZSdFHUKZXvTXzKQscGdEiFguCGS53U9",
  },
];

// Function to get all campaigns
export const getCampaigns = async () => {
  // In a real application, this would fetch from an API or blockchain
  return sampleCampaigns;
};

// Function to get a specific campaign
export const getCampaign = async (pubkey) => {
  // In a real application, this would fetch from an API or blockchain
  return sampleCampaigns.find(campaign => campaign.pubkey === pubkey) || null;
}; 