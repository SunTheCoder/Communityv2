import React, { useEffect, useState } from "react";
import { VStack, HStack, Box, Text, Spinner, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { supabase } from "../../App"; // Supabase client setup
import { Toaster, toaster } from "../ui/toaster";

const ProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const userZipCode = user?.zipCode;

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);

        // Fetch proposals for the user's zip code
        const { data, error } = await supabase
          .from("proposals")
          .select("id, title, description, proposal_status") // Add fields to fetch
          .eq("community_zip_code", userZipCode);

        if (error) throw error;

        setProposals(data);
      } catch (err) {
        console.error("Error fetching proposals:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userZipCode) {
      fetchProposals();
    }
  }, [userZipCode]);

  const handleVote = async (proposalId, vote) => {
    try {
      // Insert vote into the `votes` table
      const { error } = await supabase.from("votes").insert([
        {
          proposal_id: proposalId,
          vote_by: user.id, // Link vote to the user
          vote, // Store the vote ("yes" or "no")
          vote_type: "community_investment",
          wallet_address: user.walletAddress, // Store the user's wallet address
        },
      ]);
  
      if (error) throw error;
  
      toaster.create({
        title: "Vote Submitted",
        description: `Your vote (${vote}) has been recorded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to submit your vote.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  if (loading) {
    return <Spinner color="pink.400" size="lg" />;
  }

  if (!proposals.length) {
    return <Text>No proposals found for your area.</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" maxW="md" mx="auto" mt={6}>
      {proposals.map((proposal) => (
        <Box
        key={proposal.id}
        borderWidth="1px"
        borderRadius="lg"
        padding="4"
        bg="gray.50"
        _hover={{ bg: "gray.100" }}
      >
        <Text fontSize="lg" fontWeight="bold">
          {proposal.title}
        </Text>
        <Text>{proposal.description}</Text>
        <Text fontSize="sm" color="gray.600">
          Status: {proposal.proposal_status}
        </Text>
        <HStack mt={3}>
          <Button
            firstFlow
            size="xs"
            onClick={() => handleVote(proposal.id, "yes")}
          >
            Yes
          </Button>
          <Button
            firstFlow
            size="xs"
            onClick={() => handleVote(proposal.id, "no")}
          >
            No
          </Button>
        </HStack>
      </Box>
      ))}
    </VStack>
  );
};

export default ProposalsList;
