import React from "react";
import SignUp from "./components/SignUp"; // Import your SignUp/Login component
import AddResource from "./components/AddResource"; // Import your AddResource componentq
import ResourceList from "./components/ResourceList";
import Demo from "./components/Demo"; // Import your Demo component
import { ColorModeButton } from "./components/ui/color-mode"; // Adjust the path if necessary
import { Flex, Box } from "@chakra-ui/react"; // Adjust the imports and component names if necessary
import AddResourceDrawer from "./components/AddResourceDrawer"; // Import your AddResourceDrawer component


function App() {
  return (
    <Flex
    direction="column"
    align="center"
    justify="center"
    minHeight="100vh"
    bg="gray.50" // Light mode background
    _dark={{ bg: "gray.900" }} // Dark mode background
    px={4} // Horizontal padding for responsiveness
  >
    {/* ColorMode Button */}
    <Box position="absolute" top={4} right={4}>
      <ColorModeButton />
    </Box>

    {/* Main Content */}
    <Box
      width="100%"
      maxWidth="600px" // Constrain the width of the content
      textAlign="center" // Center text alignment
      bg="white" // Light mode content background
      _dark={{ bg: "gray.800" }} // Dark mode content background
      p={8} // Padding inside the box
      borderRadius="lg" // Rounded corners
      boxShadow="lg" // Shadow for depth
    >
      <SignUp />
      <AddResource />
      <AddResourceDrawer />
      <ResourceList />
      <Demo />
    </Box>
  </Flex>
  );
}

export default App;
