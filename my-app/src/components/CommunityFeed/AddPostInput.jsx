import React from "react";
import { useForm } from "react-hook-form";
import { Box, Input, Button, VStack, Text, Circle, Group, Icon } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import { supabase } from "../../App";
import { useSelector } from "react-redux";
import { InputGroup } from "../ui/input-group";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineUpload } from "react-icons/ai";
import DynamicUploadImage from "./DynamicUploadImage";
import { useState } from "react";
import { uploadImage } from "../../supabaseRoutes/storage/uploadImage";
import { getPublicUrl } from "../../supabaseRoutes/storage/getPublicUrl";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerTrigger,
  DrawerActionTrigger,
} from "@/components/ui/drawer";
import { Tooltip } from "../ui/tooltip";


const AddPostInput = () => {
  const { user } = useSelector((state) => state.user);
  // const [imageUrl, setUploadedImageUrl] = useState("");

  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
  const [clearPreview, setClearPreview] = useState(false); // For clearing preview

  const [content, setContent] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState(null); // Store uploaded image URL
  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleUploadComplete = () => {
    setClearPreview(true); // Trigger clearing of preview in DynamicUploadImage
    setTimeout(() => setClearPreview(false), 0); // Reset the clearPreview flag
  };

  const onSubmit = async (data) => {
    try {
      if (!user) {
        throw new Error("User not logged in. Please log in to create a post.");
      }

      let uploadedImageUrl = null;
      if (selectedFile) {
        // Upload the image
        const filePath = await uploadImage(selectedFile, "images", "community_feed_images");
        if (!filePath) throw new Error("Failed to upload image.");
        uploadedImageUrl = getPublicUrl(filePath, "images");
      }

      const postPayload = {
        content: data.content.trim(),
        image_url: uploadedImageUrl,
        author_username: user.username,
        user_id: user.id,
      };

      const { error } = await supabase.from("posts").insert([postPayload]);
      if (error) throw error;

      toaster.create({ description: "Post created successfully!", type: "success" });

      reset();
      setSelectedFile(null);
      setContent("");
      setDrawerOpen(false);
      handleUploadComplete(); // Clear preview after successful post submission
    } catch (error) {
      console.error("Error creating post:", error.message);
      toaster.create({ title: "Error Creating Post", description: error.message, type: "error" });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)} // Use form's onSubmit handler
      // pt={1}
      mx={8}
      mt="48px"
      
    //   border="1px solid"
    //   borderColor="gray.200"
      borderRadius="md"
    //   bg="gray.50"
      _dark={{ bg: "gray.800", borderColor: "gray.600" }}
    >
      <Toaster />
      <VStack spacing={4} align="stretch">
       
    <Group attached>
        {/* Post Content Input */}
        <Input
          placeholder="Write your post content..."
          {...register("content", {
            required: "Post content is required",
            minLength: { value: 5, message: "Content must be at least 5 characters" },
          })}            
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (e.target.value.length > 55) setDrawerOpen(true); // Open drawer for long posts
          }}
          
          borderRightRadius="none"
          shadow="sm"
          _focus={{ borderColor: "pink.500", bg:"pink.50" }}
          _dark={{bg:"gray.200", borderColor: "pink.600", color: "pink.900" }}
          
        //   autoFocus
        />
        
          {/* File Input for Image with Icon */}
        <Button
          firstFlow
          as="label" // Label to trigger file input
          cursor="pointer"
          size="md"
          width="50px"
          variant="ghost"

          
        >
          {/* Dynamic Image Upload */}
          <DynamicUploadImage onFileSelect={setSelectedFile} clearPreview={clearPreview} />         {/* <AiOutlineUpload/> */}
          <Input
            type="file"
            {...register("image")}
            accept="image/*"
            display="none" // Hidden input triggered by button
          />
        </Button>

<Button
  type="submit"
  firstFlow
  
  isLoading={isSubmitting} // Show loading spinner on submit
  
  borderLeftRadius="none"
  size="md"
  // color="pink.800"
  variant="plain"
  py="10px"
  position="relative"
  left="1px"
  
>
  Add Post <CiCirclePlus />
</Button>



            </Group>
        {errors.content && (
          <Text fontSize="sm" color="red.500">
            {errors.content.message}
          </Text>
        )}

        {errors.imageUrl && (
          <Text fontSize="sm" color="red.500">
            {errors.imageUrl.message}
          </Text>
        )}
        {/* File Input for Image */}
       

        {/* Submit Button */}
       
      </VStack>
       {/* Drawer for long posts */}
       <DrawerRoot open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)} placement="bottom">
        <DrawerBackdrop />
        <DrawerContent
          position="absolute"
          roundedTop="md"
          width="47%"
          ml="6%"
          border="2px solid"
          borderColor="pink.300"
          borderBottom="none"
          bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
          _dark={{
            borderColor: "pink.600",
            bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
          }}
        
        >
          <DrawerHeader>
            <DrawerTitle>Post</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                borderColor: "gray",
              }}
              placeholder="Write your full post here..."
            />
          </DrawerBody>
          <DrawerFooter>
          <Tooltip
            content="Upload an image"
          >
          <Button
            as="label" // Use label to trigger file input
            cursor="pointer"
            size="xs"
            variant="ghost"
            firstFlow
            w="50px"
           >
      {/* Dynamic Image Upload */}
      <DynamicUploadImage onFileSelect={setSelectedFile} clearPreview={clearPreview} />

      
    </Button></Tooltip>
            <DrawerActionTrigger asChild>
              <Button logout size="xs" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
            </DrawerActionTrigger>
            <Button login size="xs" onClick={handleSubmit(onSubmit)}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
};

export default AddPostInput;
