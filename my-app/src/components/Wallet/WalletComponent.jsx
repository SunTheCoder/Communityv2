import React, { useState } from "react";
// import { useAccount, useConnect, useDisconnect, useNetwork, useSendTransaction } from "wagmi";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";
import { Alert } from "../ui/alert";
import { ethers } from "ethers";

const WalletComponent = () => {
  const toast = useToast();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Transaction sending hook
  const { sendTransaction } = useSendTransaction({
    onSuccess: (tx) => {
      
    },
    onError: (error) => {
      
    },
  });

  const handleSendTransaction = async () => {
    try {
      if (!ethers.isAddress(recipient)) {
       
        return;
      }

      const valueInWei = ethers.parseEther(amount || "0");

      sendTransaction({
        to: recipient,
        value: valueInWei,
      });
    } catch (err) {
      console.error("Transaction Error:", err.message);
    }
  };

  return (
    <Box border="1px" borderRadius="md" p={5} boxShadow="md">
      <VStack spacing={4}>
        {!isConnected ? (
          <>
            <Button onClick={() => connect(connectors[0])} colorScheme="blue">
              Connect Wallet
            </Button>
          </>
        ) : (
          <>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              Wallet Connected: {address}
            </Alert>
            <Text>
              <strong>Chain:</strong> {chain?.name || "Unknown"}
            </Text>
            <Button onClick={disconnect} colorScheme="red">
              Disconnect Wallet
            </Button>

            <Input
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <Button
              colorScheme="green"
              onClick={handleSendTransaction}
              isDisabled={!recipient || !amount}
            >
              Send Transaction
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default WalletComponent;
