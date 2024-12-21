import React, { useState, useEffect } from "react";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerCloseTrigger,
} from "../ui/drawer";
import { Button, VStack, Text, Input, Spinner, Box, Collapsible, Separator } from "@chakra-ui/react";
import { IoWalletOutline } from "react-icons/io5";
import { ethers } from "ethers";
import BuyETHButton from "./BuyEthButton";
import { useSelector } from "react-redux";

const WalletDrawer = ({ walletAddress }) => {
  const userName = useSelector((state) => state.user?.user?.username || null);  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [balance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const formattedUsername = userName?.slice(0, 1).toUpperCase().concat(userName.slice(1).toLowerCase());


  // Fetch wallet balance when walletAddress changes
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!walletAddress) return;
        if (!window.ethereum) throw new Error("MetaMask is not installed.");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(balance)); // Convert wei to ETH
      } catch (error) {
        console.error("Error fetching balance:", error);
        setErrorMessage(error.message);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  // Send ETH Transaction
  const sendTransaction = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const transaction = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      setTransactionHash(transaction.hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <DrawerRoot placement="right">
      <DrawerBackdrop />
      <DrawerTrigger 
        asChild
        p={2} borderRadius="4xl" _hover={{bg:"pink.300"}} _dark={{_hover:{bg:"pink.700"}}}
        >
        <IoWalletOutline cursor="pointer" size="35px"/>
      </DrawerTrigger>
      <DrawerContent
        borderRightRadius="lg"
        border="2px solid"
        borderColor="pink.300"
        borderLeft="none"
        bg="radial-gradient(circle, #FFE4E1, #F6E6FA)"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle, #8B4A62, #2C2A35)",
        }}
      >
        <DrawerCloseTrigger>
          <Button variant="ghost">Close</Button>
        </DrawerCloseTrigger>
        <DrawerHeader>
        <Text fontSize="lg" fontWeight="bold">
          {formattedUsername}'s Ethereum Wallet
        </Text>
        </DrawerHeader>
        <Separator />
        <DrawerBody >
          <VStack spacing={4} align="stretch">
          <Collapsible.Root unmountOnExit>
  <Collapsible.Trigger >
        <Text cursor="pointer" _hover={{color:"pink.600"}}>
          <strong>Wallet Address</strong> 
        </Text>
  </Collapsible.Trigger >
  <Collapsible.Content >
        <Text >
        {walletAddress}
          
        </Text>
  </Collapsible.Content>
</Collapsible.Root>
            <Text>
              <strong>Balance:</strong>{" "}
              {balance !== null ? `${balance} ETH` : <Spinner size="sm" />}
            </Text>
            <Text fontWeight="bold">Buy ETH</Text>
            <BuyETHButton walletAddress={walletAddress} />
            <Text fontWeight="bold">Send ETH</Text>
            <Input
            
            shadow="sm"
            _focus={{ borderColor: "pink.500", bg:"pink.50" }}
            _dark={{bg:"gray.200", borderColor: "pink.600", color: "pink.900" }}
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
            
            shadow="sm"
            _focus={{ borderColor: "pink.500", bg:"pink.50" }}
            _dark={{bg:"gray.200", borderColor: "pink.600", color: "pink.900" }}
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button size="xs" firstFlow onClick={sendTransaction}>
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
        </DrawerBody>
        <DrawerFooter>
          <Text fontSize="sm" color="gray.500">Manage your Ethereum wallet seamlessly</Text>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default WalletDrawer;
