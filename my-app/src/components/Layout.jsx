import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Tabs,
  Spinner,
  IconButton,
  SimpleGrid,
  HStack,
  Separator,
  Portal,
  VStack
} from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import SignUp from "./SignUp";
import ResourceList from "./ResourceList";
import { ColorModeButton } from "./ui/color-mode";
import { supabase } from "../App";
import UserAvatar from "./UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userSlice";
import { HiOutlinePencilSquare, HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { PiFlowerLight } from "react-icons/pi";
import { Avatar, AvatarGroup } from "./ui/avatar";


import SearchBar from "./SearchBar";
import Map from "./Map";
import CommunityMap from "./CommunityMap";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import CommunityFeed from "./CommunityFeed";
import FriendAvatarGroup from "./FriendAvatarGroup";


const GEOCODE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY;

  export const geocodeAddress = async (address) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${GEOCODE_API_KEY}`;
  
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("No geocoding results found.");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error.message);
      return null;
    }
  };

const Layout = () => {
  const [value, setValue] = useState("first");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user);

  // Fetch the logged-in user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw new Error(sessionError.message);

        if (session && session.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, username, bio, avatar_url, email, role")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw new Error(profileError.message);

          dispatch(
            login({
              id: profileData.id,
              username: profileData.username,
              avatarUrl: profileData.avatar_url,
              email: profileData.email,
              role: profileData.role,
            })
          );
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
    <Box _dark={{ bg: "gray.800" }} minHeight="100vh">
            
                <Separator position='absolute' top='62px' _dark={{borderColor:"pink.600"}}/>
                
            
      {/* Grid Layout */}
      <SimpleGrid columns={20} spacing={4} p={3}>
        {/* Row 1: Avatar, Icons, Search Bar, and Logo */}
        {/* <Box gridColumn="span 1"></Box> */}
        <Box gridColumn="span 1"  >
            <FriendAvatarGroup />
        <Separator 
                    position='absolute' 
                    orientation="vertical" 
                    height="100%" 
                    marginTop="50px"
                    mx='78px'
                    _dark={{borderColor:"pink.600"}}
                    />
          {loading ? (
              <Spinner />
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <Box position="relative" left="13px">
                <UserAvatar />
                </Box>
            )}
        </Box>
        <Box gridColumn="span 1" display="flex" alignItems="center" justifyContent="start" position="relative" left="40px">
          <HiOutlinePencilSquare
            size="20"
            cursor="pointer"
            onClick={() =>
                toaster.create({
                    title: "Join our community!",
                    description: "Contribute to the community map!",
                    type: "info",
                })
            }
            />
        </Box>
        <Box gridColumn="span 1" display="flex" alignItems="center" justifyContent="start" position="relative" left="40px">
          <IoNotificationsOutline
            size="20"
            cursor="pointer"
            onClick={() =>
              toaster.create({
                title: "Community Map Updates!",
                description: "Check out the latest updates!",
                type: "info",
              })
            }
          />
        </Box>
        <Box gridColumn="span 1" display="flex" alignItems="center" justifyContent="start" position="relative" left="40px">
          <HiMiniChatBubbleLeftEllipsis
            size="20"
            cursor="pointer"
            onClick={() =>
              toaster.create({
                title: "Chat Feature",
                description: "Start a conversation in the community!",
                type: "info",
              })
            }
          />
        </Box>
        <Box gridColumn="span 12"></Box>
        <HStack gridColumn="span 4">
            <Box width="240px" paddingRight="15px">
            <SearchBar />
            </Box>
            <Box  textAlign="center" px="15px">
            <Heading as="h1" size="3xl" >
                <PiFlowerLight />

            </Heading>
            </Box>
        <Box  >
          <ColorModeButton />
        </Box>
        </HStack>
        {/* Row 2: Tabs Section */}
        <Box gridColumn="span 1"></Box>
        <Box gridColumn="span 10" maxHeight="1210px" overflow="overlay" position="relative" top={3}
             
        >
            
          <Tabs.Root value={value} onValueChange={(e) => setValue(e.value)} marginTop='12px'  variant='plain' size='lg' my='20px' >
            
            <Tabs.List
              style={{
                display: "flex",
            justifyContent: "center",
            
            width: 'calc(100%)',
            position:"relative",
            left:"50%",
            transform:"translateX(-50%)",
            gap: "1rem",
            
            
              }}
              _dark={{borderColor:"pink.600"}}
              
              
            >
              <Tabs.Trigger value="first">Feed</Tabs.Trigger>
              {/* <Tabs.Trigger value="second">Map</Tabs.Trigger> */}
              <Tabs.Trigger value="third">Resource List</Tabs.Trigger>
              {/* <Tabs.Trigger value="fourth">Fourth tab</Tabs.Trigger>
              <Tabs.Trigger value="fifth">Fifth tab</Tabs.Trigger> */}
              <Tabs.Indicator borderBottom='1px solid' borderColor='gray.300' _dark={{borderColor:"pink.600"}} bg="transparent" shadow='none'/>
            </Tabs.List>

            <Tabs.Content value="first">
                {/* <Text>Community Feed Placeholder</Text> */}
                <Box display="flex" justifyContent="center">
                <CommunityFeed/>
                </Box>
            </Tabs.Content>
            <Tabs.Content value="second">
                <Text>Map Placeholder</Text>
            </Tabs.Content>
            <Tabs.Content value="third">
                <ResourceList />
            </Tabs.Content>
            {/* <Tabs.Content value="fourth">
                
                
                <SignUp />
                </Tabs.Content> */}
                {user?.role === "admin" && (
                    <AdminDashboard/>
                    )}
          </Tabs.Root>

        

        </Box>
        <Box >
                <Separator marginTop="11px"orientation="vertical" height="100%"  width="fit-content" _dark={{borderColor:"pink.600"}}/>
        </Box>
        <Box 
            py={20}
            gridColumn="span 8"
            display="flex"
            justifyContent="center"
            

          >
                {/* <Map /> */}
                <CommunityMap/>
          </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Layout;
