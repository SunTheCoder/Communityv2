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
import { Button, VStack, Text, Input, Spinner, Box, Collapsible, Separator, HStack } from "@chakra-ui/react";
import { IoWalletOutline } from "react-icons/io5";
import { ethers } from "ethers";
import BuyETHButton from "./BuyEthButton";
import { useSelector } from "react-redux";
import { supabase } from "../../App";
import CryptoJS from "crypto-js";





const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

if (!encryptionKey) {
  console.error("Encryption key not set in environment variables.");
}

const WalletDrawer = ({ walletAddress }) => {
  const userName = useSelector((state) => state.user?.user?.username || null);
  const userId = useSelector((state) => state.user?.user?.id || null);
  const userRole = useSelector((state) => state.user?.user?.role || null); // Check if user is admin
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [balance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [communityZipCode, setCommunityZipCode] = useState("");
  const formattedUsername = userName?.slice(0, 1).toUpperCase().concat(userName.slice(1).toLowerCase());

  const encryptPrivateKey = (privateKey, encryptionKey) => {
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
    const encrypted = CryptoJS.AES.encrypt(privateKey, CryptoJS.enc.Utf8.parse(encryptionKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return {
      encryptedData: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Hex), // Convert IV to a storable format
    };
  };
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

  // Connect Wallet
  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const connectedWalletAddress = accounts[0];

      const { error } = await supabase
        .from("wallets")
        .upsert({ wallet_address: connectedWalletAddress, user_id: userId }, { onConflict: "wallet_address" });

      if (error) throw new Error("Failed to save wallet to Supabase");

      alert(`Wallet connected: ${connectedWalletAddress}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };

  // Create Personal Wallet
  const createWalletHandler = async () => {
    try {
      // Step 1: Fetch the user's profile to get the zip code
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("zip_code")
        .eq("id", userId) // Assuming `userId` is the user's ID
        .single();
  
      if (profileError || !profileData) {
        throw new Error("Failed to fetch user profile or zip code.");
      }
      const userZipCode = profileData.zip_code;
      console.log("User's zip code:", userZipCode);
  
      // Step 2: Fetch the zip_code_id from the zip_codes table
      const { data: zipCodeData, error: zipCodeError } = await supabase
        .from("zip_codes")
        .select("id")
        .eq("postal_code", userZipCode) // Assuming postal_code is the zip code column
        .single();
  
      if (zipCodeError || !zipCodeData) {
        throw new Error("Failed to fetch zip_code_id for the provided zip code.");
      }
      const zipCodeId = zipCodeData.id;
      console.log("Zip Code ID:", zipCodeId);
  
      // Step 3: Create a new wallet
      const wallet = ethers.Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;
  
      // Step 4: Insert the wallet into the database
      const { error: walletError } = await supabase
        .from("wallets")
        .insert({
          wallet_address: walletAddress,
          user_id: userId,
          zip_code_id: zipCodeId, // Add the zip_code_id to the wallet entry
        });
  
      if (walletError) {
        throw new Error("Failed to save wallet to Supabase");
      }
  
      alert(`🎉 New Wallet Created!\nAddress: ${walletAddress}\nPrivate Key: ${privateKey}`);
    } catch (error) {
      console.error("Error creating wallet:", error);
      setErrorMessage(error.message);
    }
  };
  

  // Create Community Wallet (Admin Only)
  const createCommunityWalletHandler = async () => {
    try {
      if (!communityZipCode) throw new Error("Please enter a zip code for the community.");
      
      // Fetch the zip_code_id for the provided zip code
      const { data: zipData, error: zipFetchError } = await supabase
        .from("zip_codes")
        .select("id")
        .eq("postal_code", communityZipCode)
        .single();
  
      if (zipFetchError || !zipData) {
        console.error("Zip code fetch error:", zipFetchError);
        throw new Error("Invalid zip code. Please provide a valid community zip code.");
      }
  
      const zipCodeId = zipData.id;
  
      // Create a new wallet
      const wallet = ethers.Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;
  
      // Encrypt the private key
      const { encryptedData, iv } = encryptPrivateKey(privateKey, import.meta.env.VITE_ENCRYPTION_KEY);
  
      // Save the new wallet to the wallets table
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .insert({
          wallet_address: walletAddress,
          wallet_type: "zip_code",
          zip_code_id: zipCodeId,
          encrypted_private_key: encryptedData,
          iv,
        })
        .select()
        .single();
  
      if (walletError) {
        console.error("Wallet creation error:", walletError);
        throw new Error("Failed to create community wallet.");
      }
  
      alert(`🎉 Community Wallet Created for ${communityZipCode}\nAddress: ${walletAddress}`);
    } catch (error) {
      console.error("Error creating community wallet:", error);
      setErrorMessage(error.message);
    }
  };
  
  
  

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
        <Text fontSize="2xl" fontWeight="bold" pb={1}>
            {formattedUsername}'s 
        </Text>
        <Text fontSize="lg" fontWeight="bold">
            Ethereum Wallet
        </Text>
        </DrawerHeader>
        <Separator 
            borderColor="pink.400"
            mb={4}
        />
        <DrawerBody >
          <VStack spacing={4} align="stretch">

            {/* Wallet Connection & Creation */}
            <HStack justifyContent="center">
            <Button firstFlow size="xs" w="fit-content" onClick={connectWalletHandler}>Connect Wallet</Button>
            <Button firstFlow size="xs" w="fit-content" onClick={createWalletHandler}>Create Wallet</Button>
            </HStack>
            {/* Admin: Community Wallet Creation */}
            {userRole === "admin" && (
              <VStack>
                <Text fontWeight="bold">Create Community Wallet</Text>
                <Input
                border="2px solid"
                borderColor="pink.400"
                
                outlineColor="pink.400"
                  w="200px"
                  placeholder="Enter Community Zip Code"
                  value={communityZipCode}
                  onChange={(e) => setCommunityZipCode(e.target.value)}
                />
                <Button firstFlow size="xs" w="fit-content" onClick={createCommunityWalletHandler}>Create Community Wallet</Button>
              </VStack>
            )}
            
            {/* Wallet Balance */}
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
            <VStack>
            <Text>
              <strong>Balance:</strong>{" "}
              {balance !== null ? `${balance} ETH` : <Spinner size="sm" />}
            </Text>

            {/* Buy ETH & Send ETH */}
            <Text fontWeight="bold">Buy ETH</Text>
            <BuyETHButton walletAddress={walletAddress} />
            </VStack>
            <VStack>
            <Text fontWeight="bold">Send ETH</Text>

            <Input
            border="2px solid"
            borderColor="pink.400"
            
            outlineColor="pink.400"
              w="200px"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
            border="2px solid"
            borderColor="pink.400"
            
            outlineColor="pink.400"
              w="200px"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button size="xs" w="fit-content" firstFlow onClick={sendTransaction}>
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


// const decryptPrivateKey = (encryptedData, iv, encryptionKey) => {
//     const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, Buffer.from(iv, "hex"));
    
//     let decrypted = decipher.update(encryptedData, "hex", "utf8");
//     decrypted += decipher.final("utf8");
  
//     return decrypted;
//   };