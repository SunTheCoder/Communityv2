import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from '../ui/menu';
import { Avatar } from '../ui/avatar';
import { HStack, Stack, Text, defineStyle } from '@chakra-ui/react';
import { supabase } from '../../App';
import { logout } from '../../redux/userSlice'; // Adjust the import path for your Redux slice
import { resetFriends } from '../../redux/friendSlice'; // Adjust the import path for your Redux slice
import { Toaster, toaster } from '../ui/toaster';
import SignUpDrawer from '../SignUp/SignUpDrawer';
import ProfileDrawer from '../Profile/ProfileDrawer';

const UserAvatar = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user); // Fetch user from Redux store
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);


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
      dispatch(resetFriends()); // Clear friend slice


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
        <MenuRoot positioning={{ gutter: 65}}>
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
            mx="30px"
            boxShadow="lg"
            borderRadius="md"
            bg="white"
            _dark={{ bg: "gray.700" }}
          >
            <MenuItem>Hello, {user?.username || "No Username Available"}!</MenuItem>
            <MenuItem>{user?.email || "No Email Available"}</MenuItem>
            <MenuItem>{user?.role || "No Role Available"}</MenuItem>
            <MenuItem
              value="profile"
              onClick={() => setDrawerOpen(true)} // Open the drawer
              _hover={{ bg: "gray.100", _dark: { bg: "gray.600" } }}
              _focus={{ bg: "gray.200", _dark: { bg: "gray.500" } }}
            >
              Profile
            </MenuItem>

      {/* Profile Drawer */}
      <ProfileDrawer open={drawerOpen} setOpen={setDrawerOpen} user={user} />
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
              borderRadius="sm"
              _hover={{ bg: "radial-gradient(circle, #FFD1D1, #FFC4C4)", _dark: { bg: "radial-gradient(circle, #8B0000, #2C1C1C)" } }}
              _focus={{ bg: "gray.200", _dark: { bg: "red.500" } }}
            >
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      ) : (
        <MenuRoot positioning={{ gutter: 65 }}>
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
            mx="30px"
            boxShadow="lg"
            borderRadius="md"
            bg="white"
            _dark={{ bg: "gray.700" }}
          >
            <MenuItem
              value="login"
              onClick={() => setIsDrawerOpen(true)} // Open the drawer on click
              borderRadius="sm"
              _hover={{ bg: "radial-gradient(circle, #FFF6F5, #D0F5D6)", _dark: { bg: "radial-gradient(circle, #8B4A62, #1E392A)" } }}
              // _focus={{ bg: "gray.200", _dark: { bg: "green.500" } }}
            >
              Login
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      )}

      {/* User Info
      <Stack spacing={0}>
        <Text fontWeight="bold">{user?.username || "Guest"}</Text>
      </Stack> */}

      {/* SignUpDrawer */}
      <SignUpDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </HStack>
  );
};

export default UserAvatar;
