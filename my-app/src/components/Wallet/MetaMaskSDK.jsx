import React, { useState } from 'react';
// import { useSDK } from '@metamask/sdk-react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

const MetaMaskComponent = () => {
  const { sdk, connected } = useSDK();
  const [account, setAccount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const connectToWallet = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts[0]);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const sendTransaction = async () => {
    try {
      const txParams = {
        to: recipient,
        value: `0x${(parseFloat(amount) * 1e18).toString(16)}`, // Convert amount to wei (hex)
      };

      const txHash = await sdk?.provider?.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      alert(`Transaction sent! Hash: ${txHash}`);
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed!');
    }
  };

  return (
    <Box border="1px" borderRadius="md" p={5} boxShadow="md">
      <VStack spacing={4}>
        <Button onClick={connectToWallet} colorScheme="blue">
          {connected ? 'Connected' : 'Connect Wallet'}
        </Button>
        {connected && (
          <>
            <Text>Account: {account}</Text>
            <Input
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <Button colorScheme="green" onClick={sendTransaction}>
              Send Transaction
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default MetaMaskComponent;
