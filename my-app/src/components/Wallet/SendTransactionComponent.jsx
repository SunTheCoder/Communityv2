import React, { useState } from "react";
import { VStack, Input, Button, Text, Spinner } from "@chakra-ui/react";
import { ethers } from "ethers";

const SendTransactionComponent = ({ defaultNetwork = "matic" }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRecipientValid, setIsRecipientValid] = useState(true);
  const [isAmountValid, setIsAmountValid] = useState(true);

  const validateRecipient = (value) => {
    const isValid = ethers.utils.isAddress(value);
    setIsRecipientValid(isValid);
    setRecipient(value);
  };

  const validateAmount = (value) => {
    const isValid = !isNaN(value) && parseFloat(value) > 0;
    setIsAmountValid(isValid);
    setAmount(value);
  };

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      setLoading(true);
      setTransactionHash(null);
      setErrorMessage("");

      const requiredChainId = defaultNetwork === "matic" ? "0x89" : "0x1";
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChainId !== requiredChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: requiredChainId }],
        });
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (!ethers.utils.isAddress(recipient)) throw new Error("Invalid recipient address.");
      if (isNaN(amount) || parseFloat(amount) <= 0) throw new Error("Invalid amount.");

      const transaction = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });

      setTransactionHash(transaction.hash);
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold" textAlign="center">Send ETH or MATIC</Text>
      <Input
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => validateRecipient(e.target.value)}
        size="sm"
        border="2px solid"
        borderColor={isRecipientValid ? "pink.400" : "red.400"}
      />
      {!isRecipientValid && <Text color="red.500">Invalid Address</Text>}
      <Input
        placeholder="Amount (ETH/MATIC)"
        value={amount}
        onChange={(e) => validateAmount(e.target.value)}
        size="sm"
        border="2px solid"
        borderColor={isAmountValid ? "pink.400" : "red.400"}
        type="number"
      />
      {!isAmountValid && <Text color="red.500">Invalid Amount</Text>}
      <Button
        m="auto"
        size="xs"
        w="fit-content"
        onClick={sendTransaction}
        isLoading={loading}
        isDisabled={!isRecipientValid || !isAmountValid}
      >
        Send Transaction
      </Button>
      {loading && <Spinner />}
      {transactionHash && (
        <Text color="green.500">
          Transaction sent! Hash:{" "}
          <a href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noreferrer">
            {transactionHash}
          </a>
        </Text>
      )}
      {errorMessage && (
        <Text color="red.500">
          <strong>Error:</strong> {errorMessage}
        </Text>
      )}
    </VStack>
  );
};


export default SendTransactionComponent;
