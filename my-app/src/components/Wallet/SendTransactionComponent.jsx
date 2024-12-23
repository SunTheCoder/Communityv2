import React, { useState } from "react";
import { VStack, Input, Button, Text, Spinner } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

const SendTransactionComponent = ({ defaultNetwork = "matic" }) => {
  const user = useSelector((state) => state.user.user);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRecipientValid, setIsRecipientValid] = useState(true);
  const [isAmountValid, setIsAmountValid] = useState(true);

  const validateRecipient = (value) => {
    const isValid = ethers.isAddress(value);
    setIsRecipientValid(isValid);
    setRecipient(value);
  };

  const validateAmount = (value) => {
    const isValid = !isNaN(value) && parseFloat(value) > 0;
    setIsAmountValid(isValid);
    setAmount(value);
  };

  const convertEthToMatic = async (amount, signer) => {
    try {
      const dexContractAddress = "DEX_CONTRACT_ADDRESS"; // Address of the DEX (e.g., QuickSwap)
      const dexAbi = [ /* DEX ABI */ ]; // ABI for the DEX contract
      const dexContract = new ethers.Contract(dexContractAddress, dexAbi, signer);

      const ethAmount = ethers.parseEther(amount);

      // Swap ETH for MATIC
      const tx = await dexContract.swapExactETHForTokens(
        0, // Minimum amount of MATIC (can be calculated dynamically)
        ["ETH_ADDRESS", "MATIC_ADDRESS"], // Path: ETH -> MATIC
        await signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 20 // Deadline: 20 minutes
      );

      await tx.wait();
      console.log("ETH successfully converted to MATIC.");
    } catch (error) {
      console.error("Error converting ETH to MATIC:", error.message);
      throw new Error("Conversion failed. Please ensure you have sufficient ETH.");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      setLoading(true);
      setTransactionHash(null);
      setErrorMessage("");

      const polygonChainId = "0x89"; // Polygon Mainnet
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      // Ensure the user is on Polygon Network
      if (currentChainId !== polygonChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: polygonChainId }],
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = user.walletAddress;

      // Check MATIC balance
      const maticBalance = await provider.getBalance(userAddress);

      if (maticBalance < ethers.parseEther(amount)) {
        console.log("Insufficient MATIC balance. Checking ETH balance...");
        const ethBalance = await provider.getBalance(userAddress);

        if (ethBalance >= ethers.parseEther(amount)) {
          console.log("Converting ETH to MATIC...");
          await convertEthToMatic(amount, signer);
        } else {
          throw new Error("Insufficient funds. Please add more MATIC or ETH.");
        }
      }

      const valueInWei = ethers.parseEther(amount);

      // Send MATIC transaction
      const transaction = await signer.sendTransaction({
        to: recipient,
        value: valueInWei,
      });

      setTransactionHash(transaction.hash);
      alert(`Transaction sent! Hash: ${transaction.hash}`);
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
