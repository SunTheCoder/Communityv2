import React from "react";
import { VStack, Text, Spinner, HStack } from "@chakra-ui/react";
import { ClipboardButton, ClipboardIconButton, ClipboardRoot } from "../ui/clipboard"
import { useSelector } from "react-redux";


const CommunityWalletBalance = ({ communityBalance, loading, errorMessage }) => {
    const user = useSelector((state) => state.user.user);
     
  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Community Wallet Address</Text>
      
      <ClipboardRoot value={user.communityWallet}>
        <HStack>
            <Text>{user.communityWallet}</Text>
            <ClipboardIconButton size="xs" variant="ghost"/>
        </HStack>
      </ClipboardRoot>
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
