import React from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const CommunityWalletBalance = ({ communityBalance, loading, errorMessage }) => {
    const user = useSelector((state) => state.user.user);
     
  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Community Wallet Address</Text>
      <Text>{user.communityWallet}</Text>
      <Text fontWeight="bold">Community Wallet Balance</Text>
      {loading ? (
        <Spinner size="sm" />
      ) : errorMessage ? (
        <Text color="red.500">{errorMessage}</Text>
      ) : (
        <>
          <Text>
            <strong>MATIC Balance:</strong> {communityBalance.matic !== null ? `${communityBalance.matic} MATIC` : "N/A"}
          </Text>
          <Text>
            <strong>USD Equivalent:</strong> {communityBalance.usd !== null ? `$${communityBalance.usd.toFixed(2)}` : "N/A"}
          </Text>
        </>
      )}
    </VStack>
  );
};

export default CommunityWalletBalance;
