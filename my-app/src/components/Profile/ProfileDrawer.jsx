"use client";

import { Button } from "@/components/ui/button";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AvatarImage, Box, HStack, Input, Separator, Text, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Field } from "@/components/ui/field"
import AvatarImageUpload from "../Avatar/AvatarImageUpload";
import AddFriendship from "./AddFriendship";
import PendingRequests from "./PendingRequests";
import FriendAvatarGrid from "./FriendAvatarGrid";
import FriendAccordionList from "./FriendAccordionComponent";



const ProfileDrawer = ({ user, open, setOpen  }) => {
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    username: user?.username || "",
    email: user?.email || "",
    zip_code: user?.zipCode || "",
    region: user?.region || "",
    city: user?.city || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="start" position="relative">
      <DrawerBackdrop />
      
      <DrawerContent
        
        borderRightRadius="lg"
        border="2px solid"
        borderColor="pink.400"
        borderLeft="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
        mt="73px"
        mb="430px"
      >
        <DrawerHeader>
          <DrawerTitle>{user?.username}'s Profile</DrawerTitle>
            <Separator borderColor="pink.400" mt="4" /  >
        </DrawerHeader>
        <DrawerBody>
          <Box className="space-y-4">
            <VStack
                mb="30px"

            >
            
            <Field
                
            >
              
              <Avatar
                src={user?.avatarUrl}
                size="3xl"
                
                mb="10px"
                shadow="md"
                onUpload={(url) =>
                  setFormData({ ...formData, avatar_url: url })
                }
              />
            </Field>
                <AvatarImageUpload/>
            </VStack >

            {/* Bio */}
            <Field
                label="Bio"
                mb="10px"
            >
              
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>

            {/* Email */}
            <Field
                label="Email"
                mb="10px"
            >
              
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>

            {/* Zip Code */}
            <Text
                
                mb="10px"
            >
              
              {user?.zipCode}
            </Text>

            {/* Region */}
            <Text
                label="Region"
                mb="10px"
            >
              {user?.region}
            </Text>

            {/* City */}
            <Text
                mb="10px"
            >
              
                {user?.city}
              
            </Text>
            <HStack
              justify="center"
              gap="20px"
              mt="10px"
              mb="20px"
            >
            <DrawerActionTrigger asChild>
            <Button logout size="xs" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DrawerActionTrigger>
          <Button firstFlow onClick={handleSave} size="xs">Save</Button></HStack>
            <FriendAvatarGrid/>
            {/* <FriendAccordionList/> */}
          <AddFriendship/>
          <PendingRequests/>
          </Box>
        </DrawerBody>
        <DrawerFooter>
          
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ProfileDrawer;
