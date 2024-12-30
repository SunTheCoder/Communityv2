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
import { AvatarImage, Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Field } from "@/components/ui/field"
import AvatarImageUpload from "../Avatar/AvatarImageUpload";



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
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="start">
      <DrawerBackdrop />
      
      <DrawerContent
        
        borderRightRadius="lg"
        border="2px solid"
        borderColor="pink.300"
        borderLeft="none"
        bg="radial-gradient(circle, #FFE4E1, #F6E6FA)"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle, #8B4A62, #2C2A35)",
        }}
        mt="73px"
        mb="430px"
      >
        <DrawerHeader>
          <DrawerTitle>Profile</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Box className="space-y-4">
            <HStack>
            
            <Field
                label="Avatar"
            >
              
              <Avatar
                src={user?.avatarUrl}
                onUpload={(url) =>
                  setFormData({ ...formData, avatar_url: url })
                }
              />
            </Field><AvatarImageUpload/>
            </HStack>

            {/* Username */}
            <Field
                label="Username"
            >
              
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>

            {/* Bio */}
            <Field
                label="Bio"
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
            <Field
                label="Zip Code"
            >
              
              <Input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>

            {/* Region */}
            <Field
                label="Region"
            >
              <Input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>

            {/* City */}
            <Field
                label="City"
            >
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border rounded-md"
              />
            </Field>
          </Box>
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button logout size="xs" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DrawerActionTrigger>
          <Button firstFlow onClick={handleSave} size="xs">Save</Button>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ProfileDrawer;
