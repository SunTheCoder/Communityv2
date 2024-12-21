import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, VStack, Text, Input, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const WalletInteraction = ({ walletAddress }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [balance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const userName = useSelector((state) => state.user?.user?.username || null);
  const formattedUsername = userName.slice(0, 1).toUpperCase().concat(userName.slice(1).toLowerCase());

  // Fetch Balance automatically when walletAddress changes
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(balance)); // Set balance in ETH
      } catch (error) {
        console.error("Error fetching balance:", error);
        setErrorMessage(error.message);
      }
    };

    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]);

  // Send Transaction
  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Get the connected user's signer

      const transaction = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount), // Convert ETH amount to wei
      });

      console.log("Transaction sent:", transaction);
      setTransactionHash(transaction.hash); // Save the transaction hash for reference
    } catch (error) {
      console.error("Error sending transaction:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box p={4} border="1px solid gray" borderRadius="md">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          {formattedUsername}'s Ethereum Wallet
        </Text>
        <Text>
          <strong>Wallet Address:</strong> {walletAddress}
        </Text>
        <Text>
          <strong>Balance:</strong> {balance !== null ? `${balance} ETH` : "Loading..."}
        </Text>

        <Text fontWeight="bold">Send ETH</Text>
        <Input
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button colorScheme="teal" onClick={sendTransaction}>
          Send Transaction
        </Button>

        {transactionHash && (
          <Text>
            <strong>Transaction Hash:</strong> {transactionHash}
          </Text>
        )}

        {errorMessage && (
          <Text color="red.500">
            <strong>Error:</strong> {errorMessage}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default WalletInteraction;

