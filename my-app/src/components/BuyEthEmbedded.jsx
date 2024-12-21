// import React, { useEffect } from "react";

// const BuyETHEmbedded = ({ walletAddress }) => {
//   useEffect(() => {
//     import("@ramp-network/ramp-instant-sdk").then(({ RampInstantSDK }) => {
//       new RampInstantSDK({
//         hostAppName: "YourAppName",
//         hostLogoUrl: "https://your-logo-url.com/logo.png", // Optional
//         userAddress: walletAddress, // Prefill the user's wallet address
//         defaultAsset: "ETH", // Default asset to purchase
//         containerNode: document.getElementById("ramp-container"), // Target container
//       }).show();
//     });
//   }, [walletAddress]);

//   return <div id="ramp-container" style={{ width: "100%", height: "500px" }}></div>;
// };

// export default BuyETHEmbedded;
