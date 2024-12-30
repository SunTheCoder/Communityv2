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
import SignUp from "./SignUp/SignUp";
import ResourceList from "./ResourceList";
import { ColorModeButton } from "./ui/color-mode";
import { supabase } from "../App";
import UserAvatar from "./Avatar/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userSlice";
import { HiOutlinePencilSquare, HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { PiFlowerLight } from "react-icons/pi";
import { Avatar, AvatarGroup } from "./ui/avatar";
import { Tooltip } from "@/components/ui/tooltip"




import SearchBar from "./SearchBar";
import Map from "./Map/Map";
import CommunityMap from "./Map/CommunityMap";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import CommunityFeed from "./CommunityFeed/CommunityFeed";
import FriendAvatarGroup from "./FriendAvatarGroup";
import AddPostInput from "./CommunityFeed/AddPostInput";
import { IoWalletOutline } from "react-icons/io5";
import WalletCard from "./Wallet/WalletCard";
import WalletMenu from "./Wallet/WalletMenu";
import WalletDrawer from "./Wallet/WalletDrawer";
import AvatarImageUpload from "./Avatar/AvatarImageUpload";



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
  const [walletAddress, setWalletAddress] = useState(null); // Track the wallet address

  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const [resources, setResources] = useState([]);

  const walletDescriptionLoggedOut = "Login to connect your/a crypto wallet to participate in projects that benefit your community. Invest in local proposals, track funding goals, and see how your contributions create real impact. Secure and transparent transactions powered by blockchain ensure your support goes where it is needed most."

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
            .select("id, username, bio, avatar_url, email, role, zip_code, region, zip_codes(place_name)")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw new Error(profileError.message);

         

           // Fetch wallet address
           const { data: walletData, error: walletError } = await supabase
           .from("wallets")
           .select("wallet_address")
           .eq("user_id", profileData.id)
           .eq("wallet_type", "user") // Filter for personal wallets
           .single();

           const { data: communityWalletData, error: communityWalletError } = await supabase
           .from("wallets")
           .select("wallet_address")
           .eq("wallet_type", "zip_code") // Filter for community wallets
           .eq("zip_code", profileData.zip_code) // Match by zip code
           .single();
 
         if (communityWalletError && communityWalletError.code !== "PGRST116")
           throw new Error(communityWalletError.message);

         setWalletAddress(walletData?.wallet_address || null);
         dispatch(
          login({
            id: profileData.id,
            username: profileData.username,
            avatarUrl: profileData.avatar_url,
            email: profileData.email,
            role: profileData.role,
            zipCode: profileData.zip_code,
            region: profileData.region,
            city: profileData.zip_codes?.place_name || null, // Add the city from zip_codes table
            walletAddress: walletData?.wallet_address || null, // Add wallet address if available
            communityWallet: communityWalletData?.wallet_address || null, // Community wallet that suer belongs to

          })
        );
        }
      } catch (error) {
        console.error("Error fetching user profile or wallet:", error.message);
        setError("Failed to load user profile or wallet.");
      } finally {
        setLoading(false);
      }
    };

    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select("*");

        if (resourcesError) throw new Error(resourcesError.message);

        setResources(resourcesData || []);

        // const profileIds = [
        //   ...new Set(
        //     resourcesData
        //       .map((resource) => resource.created_by_id)
        //       .filter((id) => id && id !== "null")
        //   ),
        // ];

        // if (profileIds.length > 0) {
        //   const { data: profilesData, error: profilesError } = await supabase
        //     .from("profiles")
        //     .select("id, username")
        //     .in("id", profileIds);

        //   if (profilesError) throw new Error(profilesError.message);

        //   const profileMap = profilesData.reduce((acc, profile) => {
        //     acc[profile.id] = profile.username;
        //     return acc;
        //   }, {});
        //   setProfiles(profileMap);
        // }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setErrorMessage("Unable to fetch resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();

    fetchUserProfile();
  }, [dispatch]);



  return (
    <Box 
    
    bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" 

    _dark={{ bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}} minHeight="100vh" 
      
    >
            
                <Separator position='absolute' top='62px' borderColor="pink.300" _dark={{borderColor:"pink.600"}}/>
                
            
      {/* Grid Layout */}
      <SimpleGrid columns={20} spacing={4} py="11px">
        {/* Row 1: Avatar, Icons, Search Bar, and Logo */}
        {/* <Box gridColumn="span 1"></Box> */}
        <Box gridColumn="span 1"  display="flex" flexDirection="column" alignItems="center" cursor="pointer">
            <FriendAvatarGroup />
        {/* <Separator 
                    position='absolute' 
                    orientation="vertical" 
                    height="100%" 
                    marginTop="50px"
                    mx='78px'
                    
                    _dark={{borderColor:"pink.600"}}
                    /> */}
          {loading ? (
              <Spinner />
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <Box >
                <UserAvatar />
                </Box>
            )}
        </Box>
        <Box gridColumn="span 8" display="flex" alignItems="center" justifyContent="start" position="relative" left="40px" gap="50px">
          <HiOutlinePencilSquare
            size="20"
            cursor="pointer"
            onClick={() =>
                toaster.create({
                    title: "Add Post",
                    description: "Enables a shortcut to add to a post to the community feed. Feature under development!",
                    type: "info",
                })
            }
            />
        
        <AvatarImageUpload />
          <IoNotificationsOutline
            size="20"
            cursor="pointer"
            onClick={() =>
              toaster.create({
                title: "Community Map Updates!",
                description: "Enables feedback to show when updates are happening within the community in real-time. Feature under development!",
                type: "info",
              })
            }
          />
      
        
      <HiOutlineChatBubbleLeftEllipsis 

            size="20"
            cursor="pointer"
            onClick={() =>
              toaster.create({
                title: "Direct Messages",
                description: "Enables user to user direct communication. Feature under development!",
                type: "info",
              })
            }
          />
        {/* <IoWalletOutline 

            size="20"
            cursor="pointer"
            onClick={() =>
              toaster.create({
                title: "Create Wallet",
                description: "Enables an individual to securely invest in community specific projects/entities. Feature under development!",
                type: "info",
              })
            }
          /> */}
          {/* <WalletMenu/> */}

          <Tooltip content={!user ? walletDescriptionLoggedOut : ""}>
          <div
            style={{
              opacity: user ? 1 : 0.5, // Adjust opacity
              // pointerEvents: user ? "auto" : "none", // Disable interaction if conditions aren't met
              cursor: user ? "default" : "not-allowed", // Optional cursor change
            }}
            
          >
            <WalletDrawer walletAddress={walletAddress} />
          </div>
          </Tooltip>
          
        </Box>
        
        
        <Box gridColumn="span 7"></Box>
        <HStack gridColumn="span 4">
            <Box width="240px" paddingRight="15px">
            <SearchBar resources={resources} />
            </Box>
            <Box  textAlign="center" px="15px">
            <Heading as="h1" size="3xl" >
                <PiFlowerLight />

            </Heading>
            </Box>
        <Box  
         mr={5} 
        >
          <ColorModeButton borderRadius="4xl"/>
        </Box>
        </HStack>
        {/* Row 2: Tabs Section */}
        <Box gridColumn="span 1"></Box>
        <Box gridColumn="span 10" maxHeight="1210px" overflow="overlay" position="relative" top="12px"
              borderLeft="1px solid"
            borderColor="pink.300"
            _dark={{borderColor:"pink.600"}}
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
              <Tabs.Indicator borderBottom='1px solid' borderColor='pink.300' _dark={{borderColor:"pink.600"}} bg="transparent" shadow='none'/>
            </Tabs.List>

            <Tabs.Content value="first" >
                {/* <Text>Community Feed Placeholder</Text> */}
                        <AddPostInput/>
                <Box display="flex" justifyContent="center" >

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
        
                {/* <Separator marginTop="11px"orientation="vertical" height="100%"  position="absolute" left _dark={{borderColor:"pink.600"}}/> */}
        
        <Box 
            p={20}
            gridColumn="span 9"
            display="flex"
            justifyContent="center"
            borderLeft="1px solid"
            borderColor="pink.300"
            _dark={{borderColor:"pink.600"}}
            mt="12px"

          >
                {/* <Map /> */}
          
                <CommunityMap/>
          </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Layout;
