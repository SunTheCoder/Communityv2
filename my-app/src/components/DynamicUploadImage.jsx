import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Image,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import { uploadImage } from "../supabaseRoutes/storage/uploadImage";
import { getPublicUrl } from "../supabaseRoutes/storage/getPublicUrl";
import { AiOutlineUpload } from "react-icons/ai";
import { Tooltip } from "./ui/tooltip"


const DynamicUploadImage = ({ uploadType, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
    setIsUploading(true);
    try {
      // Validate uploadType
      if (!uploadType) {
        throw new Error("No uploadType specified");
      }

      // Upload image
      const filePath = await uploadImage(file, "images", uploadType);
      if (filePath) {
        const url = getPublicUrl(filePath, "images");
        setImageUrl(url);

        if (onUploadComplete) {
          onUploadComplete(url);
        }

        toaster.create({
          title: "Upload successful",
          description: "Your image has been uploaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toaster.create({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  }
};

  return (
    <VStack spacing={4} align="center" width="full">
      <Toaster />

      {/* Unified Upload Button */}
      <Tooltip 
        content="Select and upload an image"
        contentProps={{ css: { "--tooltip-bg": "gray" } }}

        >
      <Button
        as="label"
        p={0}
        variant="plain"
        size="sm"
        isLoading={isUploading} // Show spinner during upload
        
        
        
      >
        {/* {imageUrl ? "Replace Image" : "Select & Upload Image"} */}
        <AiOutlineUpload />

        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          display="none" // Hide the input, trigger it via the button
        />
      </Button>
      </Tooltip>

      {/* Display Uploaded Image */}
      {imageUrl && (
        <Box
        position="absolute"
        maxWidth='fit-content'
        

        >
          <Image
            src={imageUrl}
            alt="Uploaded"
            maxWidth="50px"
            borderRadius="md"
            boxShadow="sm"
            
          />
        </Box>
      )}
    </VStack>
  );
};

export default DynamicUploadImage;
