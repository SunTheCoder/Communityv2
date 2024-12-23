import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Box, VStack, Text, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const WalletCard = () => {
  const user = useSelector((state) => state.user?.user);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const userAddress = user?.walletAddress;

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
  const fetchBalance = async (address) => {
    try {
      if (!address) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);

      const formattedBalance = ethers.formatEther(balance);
      setUserBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch balance on mount or when `userAddress` changes
  useEffect(() => {
    if (userAddress) {
      fetchBalance(userAddress);
    }
  }, [userAddress]);

  return (
    <Card borderRadius="md" borderWidth="1px" borderColor="pink.700" height="fit-content" boxShadow="sm">
      <CardHeader>
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          Wallet Manager
        </Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Button size="sm" colorScheme="teal" onClick={connectWalletHandler}>
            Connect Wallet
          </Button>
          <Button size="sm" colorScheme="blue" onClick={createWalletHandler}>
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
      </CardBody>
      <CardFooter>
        {errorMessage && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {errorMessage}
          </Text>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
