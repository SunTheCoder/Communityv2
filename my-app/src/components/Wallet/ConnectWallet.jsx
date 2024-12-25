import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { supabase } from "../../App";
import { useSelector, useDispatch } from "react-redux";
import userSlice from "../../redux/userSlice";
import { login, updateUser } from "../../redux/userSlice";
import { ethers } from "ethers";

const ConnectWallet = () => {
const user = useSelector((state) => state.user?.user);
const userId = (user?.id || null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const fetchAccounts = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");

      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) throw new Error("No MetaMask accounts found.");
        console.log("Connected accounts:", accounts);
      setAccounts(accounts); // Store accounts in state
      setSelectedAccount(accounts[0]); // Default to the first account
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setErrorMessage(error.message);
    }
  };

  const connectWalletHandler = async () => {
    try {
      if (!selectedAccount) throw new Error("No account selected.");
  
      // Normalize for database storage
      const normalizedAddress = selectedAccount.toLowerCase();
  
      console.log("Selected wallet address:", selectedAccount);
  
      // Check if a wallet is already saved for this user
      const { data: existingWallet, error: fetchError } = await supabase
        .from("wallets")
        .select("wallet_address")
        .eq("user_id", userId)
        .single();
  
      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Failed to fetch existing wallet.");
      }
  
      // Confirm replacement if a wallet exists
      if (existingWallet && existingWallet.wallet_address !== normalizedAddress) {
        const confirmReplace = window.confirm(
          `You already have a saved wallet: ${existingWallet.wallet_address}. Do you want to replace it with: ${normalizedAddress}?`
        );
        if (!confirmReplace) return;
      }
  
      // If wallet exists, update it; otherwise, insert a new one
      if (existingWallet) {
        const { error: updateError } = await supabase
          .from("wallets")
          .update({ wallet_address: normalizedAddress })
          .eq("user_id", userId);
  
        if (updateError) throw new Error("Failed to update wallet address.");
  
        alert(`Wallet updated: ${normalizedAddress}`);
        dispatch(
            updateUser({walletAddress: normalizedAddress})
        )
      } else {
        const { error: insertError } = await supabase
          .from("wallets")
          .insert({ wallet_address: normalizedAddress, user_id: userId });
  
        if (insertError) throw new Error("Failed to save wallet address.");
  
        alert(`Wallet saved: ${normalizedAddress}`);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };
  
  
  

  return (
    <Box>
      <h3>Connect Your Wallet</h3>

      {/* Fetch Accounts Button */}
      <Button my="2" login size="xs" onClick={fetchAccounts}>Fetch Accounts</Button>

      {/* Dropdown for Account Selection */}
      {accounts.length > 0 && (
        <Box>
          <label htmlFor="account-select">Select Wallet:</label>
          <select
            id="account-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </Box>
      )}

      {/* Connect Wallet Button */}
      {selectedAccount && (
        <Button my="3" login size="xs" onClick={connectWalletHandler}>Connect Selected Wallet</Button>
      )}

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </Box>
  );
};

export default ConnectWallet;
