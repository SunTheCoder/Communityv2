import React from "react";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";

const MetaMaskDeepLinkComponent = () => {
    const openMetaMask = async () => {
        if (typeof window.ethereum !== "undefined") {
          try {
            // Request account connection to MetaMask
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
    
            toaster.create({
              title: "MetaMask Connected",
              description: `Connected account: ${accounts[0]}`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } catch (error) {
            toaster.create({
              title: "Connection Failed",
              description: "Could not connect to MetaMask. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } else {
          // Redirect to MetaMask installation page
          window.open("https://metamask.io/download/", "_blank");
    
          toaster.create({
            title: "MetaMask Not Installed",
            description: "Please install MetaMask to use this feature.",
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
          Open MetaMask
        </Text>
        <Button colorScheme="blue" onClick={openMetaMask}>
          Open MetaMask
        </Button>
      </VStack>
    </Box>
  );
};

export default MetaMaskDeepLinkComponent;
