import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Image, HStack } from "@chakra-ui/react";
import { AiOutlineUpload } from "react-icons/ai";

const DynamicUploadImage = ({ onFileSelect, clearPreview }) => {
  const [previewUrl, setPreviewUrl] = useState(null); // For image preview

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // Generate a local preview URL
      onFileSelect(file); // Pass the file back to the parent component
    }
  };

  // Clear the preview URL if the parent clears the preview
  useEffect(() => {
    if (clearPreview) {
      setPreviewUrl(null);
    }
  }, [clearPreview]);

  return (
    <VStack spacing={4} align="center" width="full">
      <Button as="label" p={0} variant="plain" size="sm" >
        <AiOutlineUpload />
        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          display="none"
        />
      </Button>

      {previewUrl && (
  <Box
    position="absolute"
    maxWidth="fit-content"
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100%" // Ensure the box fills its parent's height
    width="100%" // Optional: Center horizontally as well
    
  >
    <Image
      src={previewUrl}
      alt="Uploaded"
      maxWidth="50px"
      borderRadius="md"
      boxShadow="sm"
      mb="35px"
    />
  </Box>
)}

    </VStack>
  );
};

export default DynamicUploadImage;
