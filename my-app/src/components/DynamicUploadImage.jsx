import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Image } from "@chakra-ui/react";
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
      <Button as="label" p={0} variant="plain" size="sm" color="pink.800">
        <AiOutlineUpload />
        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          display="none"
        />
      </Button>

      {previewUrl && (
        <Box position="absolute" maxWidth="fit-content">
          <Image
            src={previewUrl}
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
