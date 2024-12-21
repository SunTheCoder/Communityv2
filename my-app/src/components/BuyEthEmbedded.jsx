import React, { useEffect } from "react";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";

const BuyETHEmbedded = ({ walletAddress }) => {
  useEffect(() => {
    new RampInstantSDK({
      hostAppName: "CareMap", // Replace with your app's name
      hostLogoUrl: 'https://assets.ramp.network/misc/test-logo.png',
      userAddress: walletAddress, // Prefill the user's wallet address
      defaultAsset: "ETH", // Default asset to purchase
      containerNode: document.getElementById("ramp-container"), // Target container
    }).show();
  }, [walletAddress]);

  return <div id="ramp-container" style={{ width: "100%", height: "500px" }}></div>;
};

export default BuyETHEmbedded;
