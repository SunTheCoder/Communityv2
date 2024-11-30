import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from './ui/menu';
import { Avatar } from './ui/avatar';
import { HStack, Stack, Text, defineStyle } from '@chakra-ui/react';
import { supabase } from './SignUp';
import { logout } from '../redux/userSlice'; // Adjust the import path for your Redux slice
import { Toaster, toaster } from './ui/toaster';

const UserAvatar = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user); // Fetch user from Redux store
  const dispatch = useDispatch();
  

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear user from Redux store
      dispatch(logout());

      toaster.create({
        description: "Logged out successfully",
        type: "success",
      });

      console.log("Logged out successfully");
      // Optionally, navigate to login or home page
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <HStack gap={4}>
      {isLoggedIn ? (
        <MenuRoot positioning={{ gutter: 80 }}>
          {/* Menu Trigger */}
          <MenuTrigger asChild>
            <Avatar
              size="md"
              src={user?.avatarUrl || "https://via.placeholder.com/150"}
              alt={user?.username || "User avatar"}
              colorPalette="pink"
              css={ringCss}
              zIndex="1"
            />
          </MenuTrigger>

          {/* Menu Content */}
          <MenuContent
            mx="50px"
            boxShadow="lg"
            borderRadius="md"
            bg="white"
            _dark={{ bg: "gray.700" }}
          >
            <MenuItem>{user?.email || "No Email Available"}</MenuItem>
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
      ) : (
        <Avatar
          size="md"
          src="https://via.placeholder.com/150"
          alt="Guest Avatar"
          colorPalette="pink"
          css={ringCss}
          zIndex="1"
        />
      )}

      {/* User Info */}
      <Stack spacing={0}>
        <Text fontWeight="bold">{user?.username || "Guest"}</Text>
      </Stack>
    </HStack>
  );
};

export default UserAvatar;
