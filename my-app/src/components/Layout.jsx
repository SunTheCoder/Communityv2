import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Tabs,
  Stack,
  HStack,
  defineStyle,
  Spinner,
} from "@chakra-ui/react";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
  } from "./ui/menu"
import AddResourceDrawer from "./AddResourceDrawer";
import SignUp from "./SignUp";
import ResourceList from "./ResourceList";
import { ColorModeButton } from "./ui/color-mode"; // Adjust the path if necessary
import { Avatar } from "./ui/avatar"; // Adjust the path if necessary
import { supabase } from "./SignUp"; // Adjust the path if necessary

const Layout = () => {
  const [value, setValue] = useState("first");
  const [user, setUser] = useState(null); // State to hold user profile
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  // Fetch the logged-in user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Get the logged-in user's session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw new Error(sessionError.message);

        if (session && session.user) {
          // Fetch profile from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, username, bio, avatar_url, email")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw new Error(profileError.message);

          setUser(profileData); // Set the user's profile
        } else {
          setError("No user logged in.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    

      console.log("Logged out successfully");
      // Optionally, redirect the user or clear local state
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Box
      _dark={{ bg: "gray.800" }}
      minHeight="100vh" // Ensures it spans the entire height of the viewport
      display="flex"
      flexDirection="column"
      
    >
      {/* Top Section with Avatar and User Info */}
      <Box position="absolute" top={4} left={14}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          user && (
            <HStack gap={4}>
            <MenuRoot positioning={{ gutter: 80 }}>
              {/* Menu Trigger */}
              <MenuTrigger asChild>
                <Avatar
                  size="md"
                  src={user.avatar_url || "https://via.placeholder.com/150"}
                  alt={user.username || "User avatar"}
                  colorPalette="pink"
                  css={ringCss}
                  zIndex="1"
                />
              </MenuTrigger>
          
              {/* Menu Content */}
              <MenuContent mx='50px' boxShadow="lg" borderRadius="md" bg="white" _dark={{ bg: "gray.700" }}>
                <MenuItem>
                    {user.email || "No Email Available"}
                </MenuItem>
                <MenuItem 
                    value="profile" 
                    onSelect={() => console.log("Profile clicked")}
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.600" } }}
                    _focus={{ bg: "gray.200", _dark: { bg: "gray.500" } }}
                    
                    >
                  Profile
                </MenuItem>
                <MenuItem 
                    value="settings" 
                    onSelect={() => console.log("Settings clicked")}
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.600" } }}
                    _focus={{ bg: "gray.200", _dark: { bg: "gray.500" } }}
                    >
                  Settings
                </MenuItem>
                {/* <MenuSeparator /> Separator between groups */}
                <MenuItem 
                    value="logout" 
                    onClick={handleLogout}
                    _hover={{ bg: "red.400", _dark: { bg: "red.500" } }}
                    _focus={{ bg: "gray.200", _dark: { bg: "red.500" } }}
                    >

                  Logout
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          
            {/* User Info */}
            <Stack spacing={0}>
              <Text fontWeight="bold">{user.username || "Unknown User"}</Text>
              {/* <Text color="gray.500" fontSize="sm">
                {user.email || "No Email Available"}
              </Text> */}
            </Stack>
          </HStack>
          )
        )}
      </Box>

      {/* App Title */}
      <Box position="absolute" top={2} right={14}>
        <Heading as="h1" size="2xl" mb={6}>
          Community Map
        </Heading>
      </Box>

      {/* Color Mode Button */}
      <Box position="absolute" top={2} right={4} zIndex='1'>
        <ColorModeButton />
      </Box>

      {/* Tabs Section */}
      <Tabs.Root value={value} onValueChange={(e) => setValue(e.value)}>
        <Tabs.List
          style={{
            display: "flex",
            justifyContent: "center",
            
            width: 'fit-content',
            position:"relative",
            left:"50%",
            transform:"translateX(-50%)",
            gap: "1rem",
          }}
        >
          <Tabs.Trigger value="first">First tab</Tabs.Trigger>
          <Tabs.Trigger value="second">Second tab</Tabs.Trigger>
          <Tabs.Trigger value="third">Third tab</Tabs.Trigger>
          <Tabs.Trigger value="fourth">Fourth tab</Tabs.Trigger>
          <Tabs.Trigger value="fifth">Fifth tab</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="first">
          <ResourceList />
          <Box display="flex" justifyContent="center" mt={4}>
            <AddResourceDrawer />
          </Box>
        </Tabs.Content>
        <Tabs.Content value="second">
          <Box>
            <Heading as="h3">Sign Up</Heading>
            <SignUp />
          </Box>
        </Tabs.Content>
        <Tabs.Content value="third">
          <Text>Another additional content</Text>
        </Tabs.Content>
        <Tabs.Content value="fourth">
          <Text>Another additional content</Text>
        </Tabs.Content>
        <Tabs.Content value="fifth">
          <Text>Another additional content</Text>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default Layout;
