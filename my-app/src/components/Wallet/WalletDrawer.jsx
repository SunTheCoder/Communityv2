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
import { Button, VStack, Text, Input, Spinner, Box, Collapsible, Separator, HStack, Flex} from "@chakra-ui/react";
import { ClipboardButton, ClipboardIconButton, ClipboardRoot } from "../ui/clipboard"
import { Tooltip } from "../ui/tooltip";
import { LuInfo } from "react-icons/lu"



import { IoWalletOutline } from "react-icons/io5";
import { ethers } from "ethers";
import BuyETHButton from "./BuyEthButton";
import { useSelector } from "react-redux";
import { supabase } from "../../App";
import CryptoJS from "crypto-js";
import ProposalForm from "../Investment/ProposalForm";
import ProposalsList from "../Investment/ProposalList";
import SendTransactionComponent from "./SendTransactionComponent";
import UserWalletBalance from "./UserWalletBalance";
import WalletComponent from "./WalletComponent";
import MetaMaskComponent from "./MetaMaskComponent";
import MetaMaskDeepLinkComponent from "./MetaMaskDeepLinkComponent";
import CommunityWalletBalance from "./CommunityWalletBalance";
import WalletBalance from "./WalletBalance";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

if (!encryptionKey) {
  console.error("Encryption key not set in environment variables.");
}

const WalletDrawer = ({ walletAddress }) => {
    const user = useSelector((state) => state.user?.user);
  const userName = (user?.username || null);
  const userId = (user?.id || null);
  const userRole = (user?.role || null); // Check if user is admin\
  const city = (user?.city || null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [balance, setBalance] = useState({ eth: null, matic: null });
  const [errorMessage, setErrorMessage] = useState(null);

  const [gasFees, setGasFees] = useState({ gasPriceGwei: null, gasFeeMatic: null });


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



  const fetchGasFees = async () => {
    try {
      console.log("Connecting to Polygon RPC...");
      const polygonProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  
      console.log("Fetching gas price...");
      const gasPriceWei = await polygonProvider.send("eth_gasPrice", []);
      console.log("Gas price in wei:", gasPriceWei);
  
      const gasPriceGwei = ethers.formatUnits(gasPriceWei, "gwei");
      console.log("Gas price in Gwei:", gasPriceGwei);
  
      const gasLimit = 21000; // Standard gas limit for a basic transaction
      const gasFeeWei = BigInt(gasPriceWei) * BigInt(gasLimit);
      const gasFeeMatic = ethers.formatEther(gasFeeWei);
      console.log("Estimated gas fee in MATIC:", gasFeeMatic);
  
      return {
        gasPriceGwei: parseFloat(gasPriceGwei).toFixed(2),
        gasFeeMatic: parseFloat(gasFeeMatic).toFixed(6),
      };
    } catch (error) {
      console.error("Error fetching gas fees:", error);
      return null;
    }
  };
  

  // Fetch wallet balance when walletAddress changes
  
  

  // Connect Wallet
const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
  
      // Ensure Polygon network is added and selected
      await addPolygonNetwork();
  
      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const connectedWalletAddress = accounts[0];
  
      // Normalize for database storage
      const normalizedAddress = connectedWalletAddress.toLowerCase();
      console.log("Connected wallet address:", connectedWalletAddress);
  
      // Save the normalized address to the database
      const { error } = await supabase
        .from("wallets")
        .upsert(
          { wallet_address: normalizedAddress, user_id: userId },
          { onConflict: "wallet_address" }
        );
  
      if (error) throw new Error("Failed to save wallet to Supabase");
  
      // Display the checksum address to the user
      const checksumAddress = ethers.getAddress(connectedWalletAddress);
      alert(`Wallet connected: ${checksumAddress}`);
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
  
  
  

 

  const addPolygonNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x89", // Polygon Mainnet Chain ID
            chainName: "Polygon Mainnet",
            rpcUrls: ["https://polygon-rpc.com"], // Main RPC endpoint
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            blockExplorerUrls: ["https://polygonscan.com"], // Block explorer
          },
        ],
      });
      console.log("Polygon network added!");
    } catch (error) {
      console.error("Failed to add Polygon network:", error);
    }
  };
  

  return (
    <DrawerRoot placement="right" size="md">
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
        <Collapsible.Root>
        <Tooltip content="Info on Ethereum and Layer 2 Blockchain Solutions">
    <Collapsible.Trigger borderRadius="sm" cursor="pointer" my={1} p={1} fontSize="18px" _hover={{bg: "pink.300"}}> <LuInfo /></Collapsible.Trigger>
    </Tooltip>
    <Collapsible.Content>
      <Box padding="4" borderWidth="1px" borderColor="pink.600" borderRadius="sm">
       <strong>Why Layer 2?</strong>  <br /><br />
      Layer 2 solutions are designed to make cryptocurrency transactions faster, cheaper, and more efficient by handling transactions off the main blockchain (Layer 1) while maintaining the security and decentralization of Ethereum. MATIC, a token used on the Polygon network, is an excellent example of a Layer 2 asset. Even though it operates on Polygon, it remains compatible with Ethereum's blockchain as an ERC-20 token. This means you can enjoy lower fees and quicker transactions without sacrificing the security of Ethereum. Using Layer 2, like Polygon, allows you to contribute to your community investments seamlessly and affordably.
      </Box>
    </Collapsible.Content>
  </Collapsible.Root>
         {/* Wallet Connection & Creation */}
         <HStack justifyContent="center" >
            <Button login size="xs" w="fit-content" onClick={connectWalletHandler}>Connect Wallet</Button>
            <Button login size="xs" w="fit-content" onClick={createWalletHandler}>Create Wallet</Button>
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
                <Button login size="xs" w="fit-content" onClick={createCommunityWalletHandler}>Create Community Wallet</Button>
              </VStack>
            )}
            
        </DrawerHeader>
        <Separator 
            borderColor="pink.400"
            mb={4}
        />
        
        <DrawerBody >
          <VStack spacing={4} align="stretch">
            
            {/* <MetaMaskComponent /> */}
            {/* <MetaMaskDeepLinkComponent /> */}
            <Text fontSize="lg"fontWeight="bold">{formattedUsername}'s Wallet Info</Text>
            <ClipboardRoot value={user?.walletAddress}>
        <HStack>
            <Text><strong>Address: </strong>{user?.walletAddress}</Text>
            <ClipboardIconButton size="xs" variant="ghost"/>
        </HStack>
      </ClipboardRoot>
            
            <WalletBalance walletType="user" />
            <Text fontSize="lg" fontWeight="bold" mt={10}>{city} Community Wallet Info</Text>
            <ClipboardRoot value={user?.communityWallet}>
        <HStack>
            <Text><strong>Address:</strong> {user?.communityWallet}</Text>
            <ClipboardIconButton size="xs" variant="ghost"/>
        </HStack>
      </ClipboardRoot>
            <WalletBalance walletType="community" />
            <Collapsible.Root>
        <Tooltip content="Info on fees">
    <Collapsible.Trigger borderRadius="sm" cursor="pointer" my={1} p={1} fontSize="18px" _hover={{bg: "pink.300"}}> <LuInfo /></Collapsible.Trigger>
  </Tooltip>
    <Collapsible.Content>
      <Box padding="4" borderWidth="1px" borderColor="pink.600" borderRadius="sm">
       <strong>What are the fees?</strong>  <br /><br />
       Gas fees are the costs of performing transactions or executing smart contracts on the blockchain. They ensure the network stays secure and operates efficiently by rewarding miners or validators who process transactions. Gas fees vary based on network activity and are measured in <strong>Gwei</strong> (a fraction of Ethereum). On Ethereum, gas fees can sometimes be high due to congestion, but using Layer 2 solutions like Polygon helps significantly lower these fees. For example, sending MATIC on Polygon typically costs fractions of a cent compared to higher fees on Ethereum.
      </Box>
    </Collapsible.Content>
  </Collapsible.Root>
            {/* <CommunityWalletBalance />
            <UserWalletBalance/> */}

           
            
            
            <VStack>
           

            {/* Buy ETH & Send ETH */}
            {/* <Text fontWeight="bold">Buy ETH</Text> */}
            {/* <BuyETHButton walletAddress={walletAddress} /> */}
            </VStack>
            <VStack>
            {/* <Text fontWeight="bold">Send ETH</Text>

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
            </Button> */}
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
         
          <ProposalForm />
          {/* <SendTransactionComponent defaultNetwork="matic" /> */}

          <ProposalsList />
          
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