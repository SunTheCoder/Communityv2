import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import SignUp from "../SignUp";
import { ColorModeButton } from "../ui/color-mode";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here
    console.log("Login clicked");
    navigate("/main"); // Navigate to main page after login
  };

  const enterAsGuest = () => {
    console.log("Entered as Guest");
    navigate("/main"); // Navigate to main page as a guest
  };

  return (
    <Box
      
      _dark={{ bg: "gray.800" }}>
      <ColorModeButton/>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    
      _dark={{ bg: "gray.800" }}
      >
        
      
      <Stack spacing={6} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to the Community Map
        </Text>
        <SignUp/>
        <Box>
          <Button 
            variant="outline" 
            size='md' 
            onClick={enterAsGuest} 
            my={8} 
            // bg="gray.400"
            _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
            >
            Enter as Guest
          </Button>
        </Box>
      </Stack>
    </Box>
    </Box>
  );
};

export default SplashPage;
