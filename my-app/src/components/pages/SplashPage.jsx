import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import SignUp from "../SignUp/SignUp";
import { ColorModeButton } from "../ui/color-mode";
import { Blockquote } from "../ui/blockquote";
import { motion } from "framer-motion";

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

  const MotionBox = motion(Box);
  const MotionText = motion(Text);
  const MotionButton = motion(Button);

  return (
    <MotionBox
      minHeight="100vh"
      bg="radial-gradient(circle, #FFE4E1, #E6E6FA)"
      _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        minHeight="100vh"
        gap={4}
      >
        <ColorModeButton 
          position="absolute"
          right="18px"
          top="18px"
          borderRadius="4xl"
        />
        {/* Left Column - SignUp */}
        <GridItem
          as={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={6}
          bg="radial-gradient(circle, #FFE4E1, #E6E6FA)"
          _dark={{ bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}
        >
          <Box textAlign="center" maxWidth="400px" w="100%">
            <MotionText
              fontSize="2xl"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Welcome to 
            </MotionText>
            <MotionText
              fontSize="5xl"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
              mb={4}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              CareMap
            </MotionText>
            <SignUp navigate={navigate} />
            <MotionButton
              variant="solid"
              size="md"
              onClick={enterAsGuest}
              mt={8}
              bg="radial-gradient(circle, #FFE4E1, #E6E6FA)"
              _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)", color: "pink.200"}}
              _hover={{
                bg: "radial-gradient(circle, #F4C4C2, #C8C8E0)",
                _dark: { bg: "gray.600" },
                scale: 1.05
              }}
              shadow="sm"
              color="gray.600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter as Guest
            </MotionButton>
          </Box>
        </GridItem>

        {/* Right Column - Quote */}
        <GridItem
          as={motion.div}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.50"
          _dark={{ bg: "gray.900" }}
          p={6}
        >
          <VStack justify="center">
            <MotionText
              fontSize="4xl"
              color="gray.800"
              _dark={{ color: "white" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Threads of Support,
            </MotionText>
            <MotionText
              fontSize="4xl"
              color="gray.800"
              _dark={{ color: "white" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Woven Together
            </MotionText>
          </VStack>
        </GridItem>
      </Grid>
    </MotionBox>
  );
};

export default SplashPage;