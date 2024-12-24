import React, { useState } from "react";
import { useSelector } from "react-redux";
import { VStack, Text, Spinner, Button } from "@chakra-ui/react";
import { SkeletonText } from "../ui/skeleton"
import { Tooltip } from "../ui/tooltip"


import { ethers } from "ethers";
import axios from "axios";

const WalletBalance = ({ walletType }) => {
  const user = useSelector((state) => state.user?.user);
  const walletAddress =
    walletType === "user" ? user?.walletAddress : user?.communityWallet;
  const [balances, setBalances] = useState({
    ethMatic: null, // MATIC on Ethereum
    usd: null, // USD equivalent
  });
  const [gasPrices, setGasPrices] = useState({
    ethGasPrice: null, // Gas price on Ethereum
    ethGasUsd: null, // Gas cost in USD (Ethereum)
  });
  const [loading, setLoading] = useState(false);
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
        usd: ethMaticBalanceUsd.toFixed(2),
      });

      setGasPrices({
        ethGasPrice: parseFloat(ethGasPriceGwei).toFixed(2),
        ethGasUsd: ethGasCostUsd,
      });
    } catch (error) {
      console.error("Error fetching Ethereum balance or gas price:", error.message);
      setErrorMessage("Failed to fetch wallet balance or gas price.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">
        {walletType === "user" ? "Wallet Balance" : `Community Wallet Balance (${user?.zipCode})`}
      </Text>
      {loading ? (
        <Spinner size="sm" />
      ) : errorMessage ? (
        <Text color="red.500">{errorMessage}</Text>
      ) : balances.ethMatic !== null ? (
        <>
          <Text>
            <strong>MATIC on Ethereum:</strong> {balances.ethMatic || 0} MATIC
          </Text>
          <Text>
            <strong>Total USD:</strong> ${balances.usd || 0}
          </Text>
          <Text>
            <strong>Ethereum Gas Price:</strong> {gasPrices.ethGasPrice || "N/A"} Gwei (${gasPrices.ethGasUsd || "N/A"} USD)
          </Text>
        </>
      ) : (
        <SkeletonText noOfLines={2}  gap="2"/>
        )}
        <Tooltip content="Balance and fees are not yet displayed. Click the button to see latest info.">
      <Button login w="fit-content" size="xs" onClick={fetchBalancesAndGasPrices} isDisabled={loading}>
        Balance & Fees
      </Button>
        </Tooltip>
    </VStack>
  );
};

export default WalletBalance;
