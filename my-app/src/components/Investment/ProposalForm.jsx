import React, { useState } from "react";
import { Textarea, Input, Button, VStack, Text, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux"; // Access Redux state
import { Toaster, toaster } from "../ui/toaster";
import { supabase } from "../../App"; // Supabase client setup

const ProposalForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user.user); // Extract user from Redux
  const userZipCode = user?.zipCode; // User's zip code from Redux

  if (!userZipCode) {
    throw new Error("User zip code is not available. Please set it in your profile.");
  }

  const handleSubmit = async () => {
    if (!title || !description) {
      toaster.create({
        title: "Missing Fields",
        description: "Please fill out both the title and description.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Step 1: Fetch wallet ID for the user
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("id") // Fetch wallet ID
        .eq("user_id", user.id) // Match user ID from Redux
        .single();
  
      if (walletError || !walletData) {
        throw new Error("Unable to find your wallet. Please set up your wallet first.");
      }
  
      const walletId = walletData.id;
  
      // Step 2: Insert the proposal into the proposals table
      const { error: insertError } = await supabase
        .from("proposals")
        .insert([
          {
            title,
            description,
            created_by: user.id, // Link proposal to wallet
            community_zip_code: userZipCode, // Directly use Redux-provided zip code
          },
        ]);
  
      if (insertError) {
        throw insertError;
      }
  
      toaster.create({
        title: "Proposal Submitted",
        description: "Your proposal has been successfully added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Clear form fields
      setTitle("");
      setDescription("");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fetchVotedProposals = async () => {
    try {
      const { data: votedProposals, error } = await supabase
        .from("votes")
        .select("proposal_id, vote, proposal:title, description")
        .eq("vote_by", user.id);
  
      if (error) throw error;
  
      setVotedProposals(votedProposals);
    } catch (err) {
      console.error("Error fetching voting history:", err.message);
    }
  };
  
  
  return (
    <VStack spacing={4} align="stretch" maxW="md" mx="auto" mt={6}>
      <Flex fontSize="sm" fontWeight="bold" justifyContent="center" mb="2">
        Submit a New Proposal
      </Flex>
      <Input
        placeholder="Proposal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        border="2px solid"
        borderColor="pink.400"
        _focus={{ borderColor: "pink.500", outlineColor: "pink.500", outline: "2px solid pink.500" }}
      />
      <Textarea
        placeholder="Proposal Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        border="2px solid"
        borderColor="pink.400"
        _focus={{ borderColor: "pink.500", outlineColor: "pink.500", outline: "2px solid pink.500" }}
      />
      <Button
        firstFlow
        size="xs"
        m="auto"
        w="fit-content"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        isDisabled={!title || !description}
      >
        Submit Proposal
      </Button>
    </VStack>
  );
};

export default ProposalForm;
