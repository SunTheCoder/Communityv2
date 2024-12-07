import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import SignUp from "../SignUp";
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
    <Box minHeight="100vh" _dark={{ bg: "gray.800" }}>
      <ColorModeButton />
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Single column on smaller screens, 2 columns on medium+
        minHeight="100vh"
        gap={4}
      >
        {/* Left Column - SignUp */}
        <GridItem
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.100"
          _dark={{ bg: "gray.700" }}
          p={6}
        >
          <Box textAlign="center" maxWidth="400px" w="100%">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Welcome to the Community Map
            </Text>
            <SignUp navigate={navigate} />
            <Button
              variant="outline"
              size="md"
              onClick={enterAsGuest}
              mt={8}
              _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
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
          <Blockquote showDash cite="Malidoma Patrice Somé">
            If anyone thinks he is something when he is nothing, he deceives
            himself. Each one should test his own actions. Then he can take
            pride in himself, without comparing himself to anyone else.
          </Blockquote>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default SplashPage;
