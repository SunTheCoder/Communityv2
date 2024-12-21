import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "./ui/menu";
import { IconButton, Text, VStack, Box, Icon } from "@chakra-ui/react";
import { IoWalletOutline } from "react-icons/io5";
import { ethers } from "ethers";
import { supabase } from "../App";
import WalletInteraction from "./WalletInteraction"; // Import wallet interaction component
import WalletInteractionPopover from "./WalletInteraction"; // Import wallet interaction component

const WalletMenu = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasWallet, setHasWallet] = useState(false);

  // Access user ID from Redux
  const userId = useSelector((state) => state.user?.user?.id || null);
  const userName = useSelector((state) => state.user?.user?.name || null);

  // Fetch wallet on component mount
  useEffect(() => {
    if (userId) {
      fetchUserWallet(userId);
    }
  }, [userId]);

  // Fetch existing wallet for the user
  const fetchUserWallet = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("wallet_address")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching wallet from Supabase:", error);
        return;
      }

      if (data) {
        const walletAddress = data.wallet_address;
        setHasWallet(true);
        setDefaultAccount(walletAddress);
        await fetchBalance(walletAddress);
      } else {
        setHasWallet(false);
      }
    } catch (error) {
      console.error("Error checking for existing wallet:", error);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      setUserBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

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
      setDefaultAccount(walletAddress);
      await fetchBalance(walletAddress);

      if (!userId) {
        console.log("User ID not found. Wallet cannot be saved.");
        return;
      }

      const { error } = await supabase.from("wallets").upsert(
        { wallet_address: walletAddress, user_id: userId },
        { onConflict: "wallet_address" }
      );

      if (error) console.error("Error saving wallet to Supabase:", error);
      else setHasWallet(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };

  // Create a new wallet
  const createWalletHandler = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;

      if (!userId) {
        console.log("User ID not found. Wallet cannot be saved.");
        return;
      }

      const { error } = await supabase
        .from("wallets")
        .insert({ wallet_address: walletAddress, user_id: userId });

      if (error) console.error("Error saving new wallet to Supabase:", error);
      else {
        setDefaultAccount(walletAddress);
        setHasWallet(true);
        alert(`🎉 New Wallet Created!\nAddress: ${walletAddress}\nPrivate Key: ${privateKey}`);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box>
      <MenuRoot positioning={{ placement: "right-start" }}>
        <MenuTrigger p={2} borderRadius="4xl" _hover={{bg:"pink.300"}} _dark={{_hover:{bg:"pink.700"}}}>
          
            <IoWalletOutline aria-label="Wallet Menu" size="20" cursor="pointer" />
          
        </MenuTrigger>
        <MenuContent>
          {!hasWallet && <MenuItem onClick={connectWalletHandler}>Connect Wallet</MenuItem>}
          {!hasWallet && <MenuItem onClick={createWalletHandler}>Create Wallet</MenuItem>}
       
          {errorMessage && (
            <MenuItem isDisabled>
              <Text fontSize="sm" color="red.500">
                {errorMessage}
              </Text>
            </MenuItem>
          )}
          <MenuItem closeOnSelect={false}>
          {/* Wallet Interaction Component */}
      {defaultAccount && <WalletInteraction walletAddress={defaultAccount} />}
          </MenuItem>
        </MenuContent>
      </MenuRoot>

      
    </Box>
  );
};

export default WalletMenu;
