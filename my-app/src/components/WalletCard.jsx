import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Box, Card, VStack, Text } from "@chakra-ui/react";

const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      console.log("Connected wallet:", walletAddress);

      setDefaultAccount(walletAddress);
      await fetchBalance(walletAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };

  // Create a new wallet
  const createWalletHandler = () => {
    const wallet = ethers.Wallet.createRandom();
    alert(
      `🎉 Wallet Created Successfully!\n\n` +
      `Wallet Address: ${wallet.address}\n` +
      `Private Key: ${wallet.privateKey}\n\n` +
      `⚠️ Save your private key securely! You will not be able to recover it.`
    );
    console.log("Wallet created:", wallet.address);
  };

  // Fetch wallet balance
  const fetchBalance = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);

      const formattedBalance = ethers.formatEther(balance);
      setUserBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <Card.Root borderRadius="md" borderWidth="1px" borderColor="pink.700" height="fit-content" boxShadow="sm">
    <Card.Header>
      <Text fontSize="lg" fontWeight="bold" textAlign="center">
        Wallet Manager
      </Text>
    </Card.Header>
    <Card.Body>
      <VStack spacing={4} align="stretch">
        <Button firstFlow size="sm" colorScheme="teal" onClick={connectWalletHandler}>
          Connect Wallet
        </Button>
        <Button firstFlow size="sm" colorScheme="blue" onClick={createWalletHandler}>
          Create Wallet
        </Button>
        <Box>
          <Text fontSize="sm">
            <strong>Address:</strong> {defaultAccount || "Not connected"}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm">
            <strong>Balance:</strong> {userBalance !== null ? `${userBalance} ETH` : "N/A"}
          </Text>
        </Box>
      </VStack>
    </Card.Body>
    <Card.Footer>
      {errorMessage && (
        <Text color="red.500" fontSize="sm" textAlign="center">
          {errorMessage}
        </Text>
      )}
    </Card.Footer>
  </Card.Root>
  );
};

export default WalletCard;
