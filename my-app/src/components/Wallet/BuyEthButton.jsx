import React from "react";
import { Button } from "@chakra-ui/react";

const BuyETHButton = ({ walletAddress }) => {
  // Open Buy ETH Link
  const buyETH = () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    const buyLink = `https://ramp.network/buy/?userAddress=${walletAddress}&cryptoCurrency=ETH`;
    window.open(buyLink, "_blank");
  };

  return (
    <Button size="xs" firstFlow w="fit-content"onClick={buyETH}>
      Buy ETH
    </Button>
  );
};

export default BuyETHButton;
