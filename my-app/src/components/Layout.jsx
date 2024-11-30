import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Tabs,
  Spinner,
  IconButton, 
  Tooltip
} from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import SignUp from "./SignUp";
import ResourceList from "./ResourceList";
import { ColorModeButton } from "./ui/color-mode"; // Adjust the path if necessary
import { supabase } from "./SignUp"; // Adjust the path if necessary
import UserAvatar from "./UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userSlice"; // Adjust the import path
import { HiOutlinePencilSquare, HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";



const Layout = () => {
  const [value, setValue] = useState("first");
//   const [user, setUser] = useState(null); // State to hold user profile
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user); // Access Redux store

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

          dispatch(
            login({
              id: profileData.id,
              username: profileData.username,
              avatarUrl: profileData.avatar_url,
              email: profileData.email,
            })
          );
        } else {
        //   setError("No user logged in.");
        <UserAvatar/>
         
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [dispatch]);

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
       
         <UserAvatar />
        
        )}
      </Box>

      {/* DM Component*/}
      <Box 
        position="absolute" 
        top={30} 
        left={280}
        cursor="pointer" 
        zIndex={1}
        onClick={() => toaster.create({
            title: "Welcome to Community Map!",
            description: `Welcome, ${user?.username}!`,
            type: "info",
        })} 
        >

        <HiOutlinePencilSquare />

      </Box>

      {/* Post Component*/}
      
      <Box 
        position="absolute" 
        top={30} 
        left={230}
        cursor="pointer" 
        zIndex={1}
        onClick={() => toaster.create({
            title: "Join our community!",
            description: "Join our growing community and contribute to the map!",
            type: "info",
        })}
        >

        <HiMiniChatBubbleLeftEllipsis />

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
            {/* <AddResourceDrawer /> */}
          </Box>
        </Tabs.Content>
        <Tabs.Content value="second">
          <Box>
            <Heading as="h3"></Heading>
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
