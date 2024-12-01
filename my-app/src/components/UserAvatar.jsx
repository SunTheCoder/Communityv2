import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from './ui/menu';
import { Avatar } from './ui/avatar';
import { HStack, Stack, Text, defineStyle } from '@chakra-ui/react';
import { supabase } from '../App';
import { logout } from '../redux/userSlice'; // Adjust the import path for your Redux slice
import { Toaster, toaster } from './ui/toaster';
import SignUpDrawer from './SignUpDrawer';

const UserAvatar = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user); // Fetch user from Redux store
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

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
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <HStack gap={4}>
      {isLoggedIn ? (
        <MenuRoot>
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
            <MenuItem>{user?.username || "No Username Available"}</MenuItem>
            <MenuItem>{user?.email || "No Email Available"}</MenuItem>
            <MenuItem>{user?.role || "No Email Available"}</MenuItem>
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
            <MenuSeparator />
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
        <MenuRoot positioning={{ gutter: 80 }}>
          {/* Menu Trigger */}
          <MenuTrigger asChild>
            <Avatar
              size="md"
              src="https://via.placeholder.com/150"
              alt="Guest Avatar"
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
            <MenuItem
              value="login"
              onClick={() => setIsDrawerOpen(true)} // Open the drawer on click
              _hover={{ bg: "green.400", _dark: { bg: "green.500" } }}
              _focus={{ bg: "gray.200", _dark: { bg: "green.500" } }}
            >
              Login
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      )}

      {/* User Info */}
      <Stack spacing={0}>
        <Text fontWeight="bold">{user?.username || "Guest"}</Text>
      </Stack>

      {/* SignUpDrawer */}
      <SignUpDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </HStack>
  );
};

export default UserAvatar;
