import React, { useState } from "react";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";
import { toaster } from "../ui/toaster"; // Import toaster
import { ethers } from "ethers";
import { useSelector } from "react-redux";

const MetaMaskComponent = () => {
  // Fetch wallet address from Redux
  const user = useSelector((state) => state.user?.user);
  const account = user?.walletAddress; // Wallet address saved in Redux

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [connected, setConnected] = useState(false);

  // Connect to MetaMask
  const connectToMetaMask = async () => {
    if (!window.ethereum) {
      toaster.create({
        title: "MetaMask Not Installed",
        description: "Please install MetaMask to use this feature.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Verify if the connected account matches the Redux wallet address
      if (accounts[0].toLowerCase() !== account.toLowerCase()) {
        toaster.create({
          title: "Wallet Mismatch",
          description: "Connected wallet does not match the saved wallet address.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setConnected(true);
      toaster.create({
        title: "Connected",
        description: `Wallet connected: ${accounts[0]}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      toaster.create({
        title: "Connection Failed",
        description: "Could not connect to MetaMask.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Send Transaction
  const sendTransaction = async () => {
    if (!window.ethereum) {
      toaster.create({
        title: "MetaMask Not Installed",
        description: "Please install MetaMask to use this feature.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!recipient || !amount) {
      toaster.create({
        title: "Missing Fields",
        description: "Please enter both a recipient address and an amount.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Ensure Polygon network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const polygonChainId = "0x89"; // Polygon Mainnet
      if (chainId !== polygonChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: polygonChainId }],
        });
      }

      // Transaction parameters
      const txParams = {
        from: account, // Redux wallet address
        to: recipient,
        value: ethers.parseEther(amount).toHexString(), // Convert amount to wei
        gas: "0x5208", // 21000 GWEI (adjust if needed)
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });

      toaster.create({
        title: "Transaction Sent",
        description: `Transaction hash: ${txHash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      toaster.create({
        title: "Transaction Failed",
        description: error.message || "An error occurred while sending the transaction.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={5}
      boxShadow="md"
      maxW="400px"
      mx="auto"
      mt={8}
    >
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          MetaMask Wallet Transactions
        </Text>
        {connected ? (
          <>
            <Text>
              <strong>Connected Account:</strong> {account}
            </Text>
            <Input
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              placeholder="Amount (in MATIC)"
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button colorScheme="green" onClick={sendTransaction}>
              Send Transaction
            </Button>
          </>
        ) : (
          <Button colorScheme="blue" onClick={connectToMetaMask}>
            Connect Wallet
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default MetaMaskComponent;
