import React from 'react';

import { Button } from "./ui/button"
import { HStack } from "@chakra-ui/react"

const Demo = () => {

    const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // Simulate an API call
  };
  return (
    <HStack>
      <Button
        loading={isLoading}
        loadingText="Submitting..."
        colorScheme="teal"
        onClick={handleClick}>Click me</Button>
      <Button>Click me</Button>
    </HStack>
  )
}

export default Demo