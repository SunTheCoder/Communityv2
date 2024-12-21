import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import SignUp from "../SignUp/SignUp";
import { ColorModeButton } from "../ui/color-mode";
import { Blockquote } from "../ui/blockquote";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login clicked");
    navigate("/main"); // Navigate to main page after login
  };

  const enterAsGuest = () => {
    console.log("Entered as Guest");
    navigate("/main"); // Navigate to main page as a guest
  };

  return (
    <Box minHeight="100vh" 
    bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" 
                    
    _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}>
      
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Single column on smaller screens, 2 columns on medium+
        minHeight="100vh"
        gap={4}
        
      >
        <ColorModeButton 
        position="absolute"
        left="15px"
        top="15px"
        
        />
        {/* Left Column - SignUp */}
        <GridItem
          display="flex"
          justifyContent="center"
          alignItems="center"
         
          
          p={6}
          bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" 

    _dark={{ bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}
        >
          <Box textAlign="center" maxWidth="400px" w="100%">
            <Text fontSize="2xl" fontWeight="bold" >
              Welcome to 
            </Text>
            <Text
              fontSize="5xl"
              fontWeight="bold" mb={4}
            >
              CareMap
            </Text>
            <SignUp navigate={navigate} />
            <Button
              variant="solid"
              size="md"
              onClick={enterAsGuest}
              mt={8}
              bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" // Very light pink to lavender
              _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)", color: "pink.200"}}
              _hover={{bg: "radial-gradient(circle, #F4C4C2, #C8C8E0)", _dark: { bg: "gray.600" } }}
              shadow="sm"
              color="gray.600"
            >
              Enter as Guest
            </Button>
          </Box>
        </GridItem>

        {/* Right Column - Quote */}
        <GridItem
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.50"
          _dark={{ bg: "gray.900" }}
          p={6}
        >
          <VStack  justify="center">
          <Text fontSize="4xl">
          {/* There is one thing you have got to learn about our movement. Three people are better than no people. */}
          Threads of Support,
            </Text>
            <Text fontSize="4xl">
              Woven Together
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
    
  );
};

export default SplashPage; 