import React, { useEffect, useState } from "react";
import { VStack, HStack, Box, Text, Spinner, Button, Badge } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { supabase } from "../../App"; // Supabase client setup
import { Toaster, toaster } from "../ui/toaster";
import axios from "axios";

const ProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [closedProposals, setClosedProposals] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

    const [exchangeRates, setExchangeRates] = useState({ eth: 0, matic: 0 });


  const user = useSelector((state) => state.user.user);
  const userZipCode = user?.zipCode;

  const fetchProposalsAndVotes = async () => {
    try {
      setLoading(true);

      // Step 1: Fetch all proposals
      const { data: allProposals, error: proposalsError } = await supabase
        .from("proposals")
        .select("id, title, description, proposal_status, community_zip_code, funding_required")
        .eq("community_zip_code", userZipCode);
        

      if (proposalsError) throw proposalsError;

      console.log("Fetched proposals:", allProposals);

      // Step 2: Fetch all votes for the proposals
      const proposalIds = allProposals.map((proposal) => proposal.id);
      const { data: allVotes, error: votesError } = await supabase
        .from("votes")
        .select("proposal_id, vote")
        .in("proposal_id", proposalIds);

      if (votesError) throw votesError;

      console.log("Fetched votes:", allVotes);

      // Step 3: Calculate vote counts for each proposal
      const voteCounts = proposalIds.reduce((acc, id) => {
        acc[id] = { yes: 0, no: 0 };
        return acc;
      }, {});

      allVotes.forEach((vote) => {
        if (voteCounts[vote.proposal_id]) {
          voteCounts[vote.proposal_id][vote.vote] += 1;
        }
      });

      console.log("Calculated vote counts:", voteCounts);

      // Step 4: Separate proposals into open and closed
      const openProposals = [];
      const closedProposals = [];
      allProposals.forEach((proposal) => {
        const enhancedProposal = {
          ...proposal,
          yesVotes: voteCounts[proposal.id]?.yes || 0,
          noVotes: voteCounts[proposal.id]?.no || 0,
        };

        if (proposal.proposal_status === "closed") {
          closedProposals.push(enhancedProposal);
        } else {
          openProposals.push(enhancedProposal);
        }
      });

      setProposals(openProposals);
      setClosedProposals(closedProposals);

      // Step 5: Fetch user voting history
      const { data: userVotes, error: userVotesError } = await supabase
        .from("votes")
        .select("proposal_id, vote")
        .eq("vote_by", user.id);

      if (userVotesError) throw userVotesError;

      setVotingHistory(userVotes);

      console.log("User voting history:", userVotes);
    } catch (err) {
      console.error("Error fetching proposals and votes:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userZipCode && user.id) {
      fetchProposalsAndVotes();

      const fetchExchangeRates = async () => {
        try {
          const response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,polygon&vs_currencies=usd"
          );
          const { ethereum, polygon } = response.data;
      
          if (ethereum?.usd && polygon?.usd) {
            setExchangeRates({ eth: ethereum.usd, matic: polygon.usd });
          } else {
            throw new Error("Incomplete CoinGecko data");
          }
        } catch {
          console.warn("Using fallback API...");
          try {
            const fallbackResponse = await axios.get(
              "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,MATIC&tsyms=USD"
            );
            const { ETH, MATIC } = fallbackResponse.data;
            if (ETH?.USD && MATIC?.USD) {
              setExchangeRates({ eth: ETH.USD, matic: MATIC.USD });
            } else {
              throw new Error("Fallback API failed");
            }
          } catch (error) {
            console.error("All exchange rate sources failed:", error.message);
            toaster.create({
              title: "Error",
              description: "Unable to fetch exchange rates from any source.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };
      
  
      fetchExchangeRates();
    }
  }, [userZipCode, user.id]);

  const convertToCrypto = (usd, rate) => (usd / rate).toFixed(4);

  const handleVote = async (proposalId, vote) => {
    try {
      // Insert vote into the `votes` table
      const { error } = await supabase.from("votes").insert([
        {
          proposal_id: proposalId,
          vote_by: user.id,
          vote, // "yes" or "no"
        },
      ]);

      if (error) throw error;

      // Refresh proposals and votes after voting
      await fetchProposalsAndVotes();

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

  return (
    <VStack spacing={6} align="stretch" maxW="md" mx="auto" mt={6}>
     {/* Open Proposals */}
{proposals.length > 0 && (
  <>
    <Text fontSize="xl" fontWeight="bold">
      Open Proposals
    </Text>
    {proposals.map((proposal) => {
      const hasVoted = votingHistory.some((vote) => vote.proposal_id === proposal.id);

      return (
        
        <Box
          key={proposal.id}
          borderWidth="1px"
          borderRadius="lg"
          padding="4"
          bg="gray.50"
          _hover={{ bg: "gray.100" }}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="bold">
              {proposal.title}
            </Text>
            {hasVoted && (
              <Badge colorPalette="red" fontSize="0.8em">
                Voted
              </Badge>
            )}
          </HStack>
          <Text>{proposal.description}</Text>
          <Text>
            Status: {proposal.proposal_status === "open" ? "Open" : "Closed"}
        </Text>
          <Text fontSize="sm" color="gray.600">
            Funding Needed: ${proposal.funding_required}.00
          </Text>
          <Text fontSize="sm" color="gray.600">
              Equivalent in ETH:{" "}
              {convertToCrypto(proposal.funding_required, exchangeRates.eth)} ETH
            </Text>
            <Text fontSize="sm" color="gray.600">
              Equivalent in MATIC:{" "}
              {convertToCrypto(proposal.funding_required, exchangeRates.matic)}{" "}
              MATIC
            </Text>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Yes Votes: {proposal.yesVotes} | No Votes: {proposal.noVotes}
          </Text>
          <HStack mt={3}>
            <Button
              size="xs"
              colorScheme="green"
              onClick={() => handleVote(proposal.id, "yes")}
              disabled={hasVoted}
            >
              Yes
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => handleVote(proposal.id, "no")}
              disabled={hasVoted}
            >
              No
            </Button>
          </HStack>
        </Box>
      );
    })}
  </>
)}


      {/* Voting History */}
      {votingHistory.length > 0 && (
        <>
          <Text fontSize="xl" fontWeight="bold">
            Voting History
          </Text>
          {votingHistory.map((vote) => {
            const voteCounts = proposals.find((p) => p.id === vote.proposal_id) || {};
            return (
              <Box key={vote.proposal_id} borderWidth="1px" borderRadius="lg" padding="4">
                <Text>Proposal: {voteCounts.title}</Text>
                <Text>Your Vote: {vote.vote}</Text>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  Yes Votes: {voteCounts.yesVotes || 0} | No Votes: {voteCounts.noVotes || 0}
                </Text>
              </Box>
            );
          })}
        </>
      )}

      {/* Closed Proposals */}
      {closedProposals.length > 0 && (
        <>
          <Text fontSize="xl" fontWeight="bold">
            Closed Proposals
          </Text>
          {closedProposals.map((proposal) => (
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
              <Text fontSize="sm" color="gray.600" mt={2}>
                Yes Votes: {proposal.yesVotes} | No Votes: {proposal.noVotes}
              </Text>
            </Box>
          ))}
        </>
      )}
    </VStack>
  );
};

export default ProposalsList;
