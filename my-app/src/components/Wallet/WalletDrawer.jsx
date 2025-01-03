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
import { Button, VStack, Text, Input, Spinner, Box, Collapsible, Separator, HStack, Flex, List, ListItem} from "@chakra-ui/react";
import { ClipboardButton, ClipboardIconButton, ClipboardRoot } from "../ui/clipboard"
import { Tooltip } from "../ui/tooltip";
import { LuInfo } from "react-icons/lu"
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
  } from "../ui/accordion"





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
import ConnectWallet from "./ConnectWallet";

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
  
  const blockchainDescription = "Blockchain is a digital ledger technology that records transactions across a network of computers in a secure, transparent, and decentralized manner. Each transaction is grouped into a \"block,\" and these blocks are linked together in a chronological sequence, forming a \"chain.\""

  const blochchainHow = [
    "Decentralization: Unlike traditional systems that rely on a single central server, blockchain uses a distributed network where all participants (called nodes) share and validate data.",
    "Transparency: Every transaction is recorded on a shared ledger that is visible to all participants. Once a transaction is added, it is nearly impossible to alter without the agreement of the entire network.",
    "Security: Transactions are encrypted and grouped into blocks that are validated using consensus mechanisms such as Proof of Work (PoW) or Proof of Stake (PoS). This makes tampering extremely difficult.",
    "Immutability: Once data is recorded on the blockchain, it cannot be easily modified or deleted, ensuring trust and reliability.",
    "Smart Contracts: Many blockchains, like Ethereum and Polygon, allow for programmable agreements called smart contracts, which automatically execute predefined actions when conditions are met.",
  ];
  
  const blockchainImportance = [
    "Trust: Blockchain eliminates the need for intermediaries (like banks or authorities) by establishing trust through cryptographic proofs and consensus.",
    "Efficiency: Transactions can happen directly between parties, reducing time and costs.",
    "Inclusion: Blockchain provides opportunities for individuals and communities who lack access to traditional financial systems.",
  ];

  const layer2Description = "Layer 2 solutions are designed to make cryptocurrency transactions faster, cheaper, and more efficient by handling transactions off the main blockchain (Layer 1) while maintaining the security and decentralization of Ethereum. MATIC, a token used on the Polygon network, is an excellent example of a Layer 2 asset. Even though it operates on Polygon, it remains compatible with Ethereum's blockchain as an ERC-20 token. This means you can enjoy lower fees and quicker transactions without sacrificing the security of Ethereum. Using Layer 2, like Polygon, allows you to contribute to your community investments seamlessly and affordably."

  const blockchainMission = [
    "Decentralization: The app’s reliance on blockchain removes control from centralized entities, ensuring that no single party has undue influence over the system. This decentralization aligns with the values of fairness, autonomy, and self-governance.", 
    "Transparency and Trust: Blockchain ensures that community actions, such as resource sharing, transactions, or decision-making, are transparent and verifiable. -The immutable nature of the ledger fosters trust among users, which is crucial for building strong, resilient communities.",
    "Financial Resilience: Blockchain-based tokens or cryptocurrencies can enable communities to transact even in areas with limited banking infrastructure. Smart contracts ensure fair exchanges and reduce the risk of fraud or exploitation.",
    "Community Empowerment: The app can enable users to manage resources, vote on decisions, and participate in community activities directly through blockchain. This encourages active involvement and reduces reliance on external authorities.",
    "Resilience in Crises: During disruptions or disasters, a blockchain-based system remains operational as long as the network is active, offering a dependable platform for organizing aid, sharing resources, or rebuilding trust."
   ]

  
  const walletDescription = "This feature lets you connect your/a crypto wallet to participate in projects that benefit your community. Invest in local proposals, track funding goals, and see how your contributions create real impact. Secure and transparent transactions powered by blockchain ensure your support goes where it is needed most."
  const walletDescriptionLoggedOut = "Login to connect your/a crypto wallet to participate in projects that benefit your community. Invest in local proposals, track funding goals, and see how your contributions create real impact. Secure and transparent transactions powered by blockchain ensure your support goes where it is needed most."
  
  const infoItems = [
    { value: "a", title: "What is Blockchain?", text: blockchainDescription },
    { value: "b", title: "How does Blockchain work?", text: blochchainHow },
    { value: "c", title: "Why is Blockchain important?", text: blockchainImportance },
    { value: "d", title: "Why Layer 2?", text: layer2Description },
    { value: "e", title: "Why Blockchain Supports This Mission?", text: blockchainMission },

    { value: "f", title: "Is this secure?", text: "Some value 3..." },
    { value: "g", title: "Why should I download the Metamask extension?", text: "Some value 4..." },
  ]
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
      if (accounts.length === 0) throw new Error("No MetaMask accounts found.");
  
      console.log("Available accounts:", accounts);
  
      // Display a selection prompt if multiple accounts are detected
      const selectedAccount = accounts[0]; // Default to the first account
      const normalizedAddress = selectedAccount.toLowerCase(); // Normalize for database storage
  
      console.log("Selected wallet address:", selectedAccount);
  
      // Save the selected account to the database
      const { error } = await supabase
        .from("wallets")
        .upsert(
          { wallet_address: normalizedAddress, user_id: userId },
          { onConflict: "wallet_address" }
        );
  
      if (error) throw new Error("Failed to save wallet to Supabase");
  
      // Display the checksum address to the user
      const checksumAddress = ethers.getAddress(selectedAccount);
      alert(`Wallet connected: ${checksumAddress}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };
  
  

  // Create Personal Wallet
  const createWalletHandler = async () => {
    try {
      // Ensure MetaMask is available
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to connect your wallet.");
      }
  
      // Request connection to MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0]; // First account in MetaMask
  
      console.log("Connected Wallet Address:", walletAddress);
  
      // Step 1: Fetch the user's profile to get the zip code
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("zip_code")
        .eq("id", userId)
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
        .eq("postal_code", userZipCode)
        .single();
  
      if (zipCodeError || !zipCodeData) {
        throw new Error("Failed to fetch zip_code_id for the provided zip code.");
      }
      const zipCodeId = zipCodeData.id;
  
      // Step 3: Save the wallet address to the database
      const { error: walletError } = await supabase
        .from("wallets")
        .insert({
          wallet_address: walletAddress,
          user_id: userId,
          zip_code_id: zipCodeId,
        });
  
      if (walletError) {
        throw new Error("Failed to save wallet to Supabase");
      }
  
      alert(`🎉 Wallet Connected!\nAddress: ${walletAddress}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };
  
//   const createWalletHandler = async () => {
//     try {
//       // Step 1: Fetch the user's profile to get the zip code
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("zip_code")
//         .eq("id", userId) // Assuming `userId` is the user's ID
//         .single();
  
//       if (profileError || !profileData) {
//         throw new Error("Failed to fetch user profile or zip code.");
//       }
//       const userZipCode = profileData.zip_code;
//       console.log("User's zip code:", userZipCode);
  
//       // Step 2: Fetch the zip_code_id from the zip_codes table
//       const { data: zipCodeData, error: zipCodeError } = await supabase
//         .from("zip_codes")
//         .select("id")
//         .eq("postal_code", userZipCode) // Assuming postal_code is the zip code column
//         .single();
  
//       if (zipCodeError || !zipCodeData) {
//         throw new Error("Failed to fetch zip_code_id for the provided zip code.");
//       }
//       const zipCodeId = zipCodeData.id;
//       console.log("Zip Code ID:", zipCodeId);
  
//       // Step 3: Create a new wallet
//       const wallet = ethers.Wallet.createRandom();
//       const walletAddress = wallet.address;
//       const privateKey = wallet.privateKey;
  
//       // Step 4: Insert the wallet into the database
//       const { error: walletError } = await supabase
//         .from("wallets")
//         .insert({
//           wallet_address: walletAddress,
//           user_id: userId,
//           zip_code_id: zipCodeId, // Add the zip_code_id to the wallet entry
//         });
  
//       if (walletError) {
//         throw new Error("Failed to save wallet to Supabase");
//       }
  
//       alert(`🎉 New Wallet Created!\nAddress: ${walletAddress}\nPrivate Key: ${privateKey}`);
//     } catch (error) {
//       console.error("Error creating wallet:", error);
//       setErrorMessage(error.message);
//     }
//   };
  

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
  
      // Use Infura to create a wallet
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_INFURA_API_KEY);
      const wallet = ethers.Wallet.createRandom().connect(provider);
  
      const walletAddress = wallet.address;
  
      console.log("Generated Community Wallet Address:", walletAddress);
  
      // Save the wallet address to the database
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .insert({
          wallet_address: walletAddress,
          wallet_type: "zip_code",
          zip_code_id: zipCodeId,
        });
  
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
  
//   const createCommunityWalletHandler = async () => {
//     try {
//       if (!communityZipCode) throw new Error("Please enter a zip code for the community.");
      
//       // Fetch the zip_code_id for the provided zip code
//       const { data: zipData, error: zipFetchError } = await supabase
//         .from("zip_codes")
//         .select("id")
//         .eq("postal_code", communityZipCode)
//         .single();
  
//       if (zipFetchError || !zipData) {
//         console.error("Zip code fetch error:", zipFetchError);
//         throw new Error("Invalid zip code. Please provide a valid community zip code.");
//       }
  
//       const zipCodeId = zipData.id;
  
//       // Create a new wallet
//       const wallet = ethers.Wallet.createRandom();
//       const walletAddress = wallet.address;
//       const privateKey = wallet.privateKey;
  
//       // Encrypt the private key
//       const { encryptedData, iv } = encryptPrivateKey(privateKey, import.meta.env.VITE_ENCRYPTION_KEY);
  
//       // Save the new wallet to the wallets table
//       const { data: walletData, error: walletError } = await supabase
//         .from("wallets")
//         .insert({
//           wallet_address: walletAddress,
//           wallet_type: "zip_code",
//           zip_code_id: zipCodeId,
//           encrypted_private_key: encryptedData,
//           iv,
//         })
//         .select()
//         .single();
  
//       if (walletError) {
//         console.error("Wallet creation error:", walletError);
//         throw new Error("Failed to create community wallet.");
//       }
  
//       alert(`🎉 Community Wallet Created for ${communityZipCode}\nAddress: ${walletAddress}`);
//     } catch (error) {
//       console.error("Error creating community wallet:", error);
//       setErrorMessage(error.message);
//     }
//   };
  
  
  

 

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
      {user ? (
      <Tooltip content={walletDescription}>
        
        <DrawerTrigger 
          asChild
          p={2} 
          borderRadius="4xl" 
          _hover={{ bg: "pink.300", cursor: "pointer" }}
          _dark={{ _hover: { bg: "pink.700" } }}
        >
          <IoWalletOutline size="35px" />
        </DrawerTrigger>

        </Tooltip>
      ) : (
        <Tooltip content={walletDescriptionLoggedOut}>
          <DrawerTrigger 
            asChild
            p={2} 
            borderRadius="4xl" 
            _hover={{ bg: "pink.300", cursor: "pointer" }}
            _dark={{ _hover: { bg: "pink.700" } }}
            onClick={(e) => {
              e.preventDefault(); // Prevents interaction
              console.log("DrawerTrigger is disabled");
            }}
            >
            <IoWalletOutline size="35px"  />
          </DrawerTrigger>
        </Tooltip>
      )}
      <DrawerContent
        borderRightRadius="lg"
        border="2px solid"
        borderColor="pink.300"
        borderLeft="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
      
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
      >
        <DrawerCloseTrigger borderRadius="sm" outlineColor="pink.400">
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
    <AccordionRoot collapsible>
  {infoItems.map((item, index) => (
    <AccordionItem key={index} value={item.value}>
      <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
      <AccordionItemContent>
        {Array.isArray(item.text) ? (
          <List.Root spacing={3}>
            {item.text.map((listItem, listIndex) => (
              <List.Item mb={3} key={listIndex}>{listItem}</List.Item>
            ))}
          </List.Root>
        ) : (
          <p>{item.text}</p>
        )}
      </AccordionItemContent>
    </AccordionItem>
  ))}
</AccordionRoot>


    </Collapsible.Content>
  </Collapsible.Root>
         {/* Wallet Connection & Creation */}
         <HStack mt={4} >
            <ConnectWallet />
            {/* <Button login size="xs" w="fit-content" onClick={connectWalletHandler}>Connect Wallet</Button> */}
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
         
          <ProposalForm user={user} />
          {/* <SendTransactionComponent defaultNetwork="matic" /> */}

          <ProposalsList user={user} />
          
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