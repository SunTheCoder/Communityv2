import React, { useState, useEffect } from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import axios from "axios";

const UserWalletBalance = () => {
  const user = useSelector((state) => state.user?.user);
  const walletAddress = user?.walletAddress;
  const [balances, setBalances] = useState({
    ethMatic: null, // MATIC on Ethereum
    totalMatic: null,
    usd: null,
  });
  const [gasPrices, setGasPrices] = useState({
    ethGasPrice: null, // Gas price on Ethereum
    ethGasUsd: null, // Gas cost in USD (Ethereum)
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchBalancesAndGasPrices = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (!walletAddress) throw new Error("Wallet address not found.");

      // Fetch MATIC and ETH prices in USD
      const priceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network,ethereum&vs_currencies=usd"
      );
      const maticUsdPrice = priceResponse.data["matic-network"].usd;
      const ethUsdPrice = priceResponse.data["ethereum"].usd;

      // Ethereum Mainnet Setup
      const ethProvider = new ethers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      );

      // Fetch MATIC on Ethereum Mainnet (ERC-20)
      const maticContract = new ethers.Contract(
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // MATIC ERC-20 contract on Ethereum Mainnet
        ["function balanceOf(address owner) view returns (uint256)"],
        ethProvider
      );
      const ethMaticBalance = await maticContract.balanceOf(walletAddress);
      const formattedEthMaticBalance = ethers.formatEther(ethMaticBalance);
      const ethMaticBalanceUsd = parseFloat(formattedEthMaticBalance) * maticUsdPrice;

      // Fetch gas price on Ethereum Mainnet
      const ethGasPriceWei = await ethProvider.send("eth_gasPrice", []);
      const ethGasPriceGwei = ethers.formatUnits(ethGasPriceWei, "gwei");
      const ethGasCostUsd = (
        parseFloat(ethers.formatEther(BigInt(ethGasPriceWei) * BigInt(21000))) * ethUsdPrice
      ).toFixed(2);

      // Update state
      setBalances({
        ethMatic: parseFloat(formattedEthMaticBalance),
        totalMatic: parseFloat(formattedEthMaticBalance).toFixed(4),
        usd: ethMaticBalanceUsd.toFixed(2),
      });

      setGasPrices({
        ethGasPrice: parseFloat(ethGasPriceGwei).toFixed(2),
        ethGasUsd: ethGasCostUsd,
      });
    } catch (error) {
      console.error("Error fetching balances and gas prices:", error.message);
      setErrorMessage("Failed to fetch wallet balances or gas prices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalancesAndGasPrices();
  }, [walletAddress]);

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">User Wallet Balance</Text>
      {loading ? (
        <Spinner size="sm" />
      ) : errorMessage ? (
        <Text color="red.500">{errorMessage}</Text>
      ) : (
        <>
          <Text>
            <strong>MATIC on Ethereum:</strong> {balances.ethMatic || 0} MATIC
          </Text>
          <Text>
            <strong>Total MATIC:</strong> {balances.totalMatic || 0} MATIC
          </Text>
          <Text>
            <strong>Total USD:</strong> ${balances.usd || 0}
          </Text>
          <Text>
            <strong>Ethereum Gas Price:</strong> {gasPrices.ethGasPrice || "N/A"} Gwei (${gasPrices.ethGasUsd || "N/A"} USD)
          </Text>
        </>
      )}
    </VStack>
  );
};

export default UserWalletBalance;
