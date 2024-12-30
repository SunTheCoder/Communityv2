import { useState } from "react";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import { AiOutlineUpload } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Toaster, toaster } from "@/components/ui/toaster"
import { uploadImage } from "../../supabaseRoutes/storage/uploadImage";
import { getPublicUrl } from "../../supabaseRoutes/storage/getPublicUrl";



import { supabase } from "../../App"

const AvatarImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState(null); // For image preview
  const [selectedFile, setSelectedFile] = useState(null); // For storing the file
  const [isUploading, setIsUploading] = useState(false); // Track upload state
    const user = useSelector((state) => state.user?.user);

  // Handle file selection and generate preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
      setSelectedFile(file); // Save the file to state
    }
  };

  // Handle the upload and database update
  const handleUpload = async () => {
    try {
      if (!user) throw new Error("User not logged in.");
      if (!selectedFile) throw new Error("No file selected.");

      setIsUploading(true);

      let uploadedImageUrl = null;
           if (selectedFile) {
             // Upload the image
             const filePath = await uploadImage(selectedFile, "images", "avatar_images");
             if (!filePath) throw new Error("Failed to upload image.");
             uploadedImageUrl = getPublicUrl(filePath, "images");
           }

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles") // Replace with your table name
        .update({ avatar_url: uploadedImageUrl })
        .eq("id", user.id); // Ensure you're updating the correct user

      if (updateError) throw new Error(updateError.message);

      toaster.create({
        title: "Avatar Updated",
        description: "Your avatar has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset state
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading avatar:", error.message);
      toaster.create({
        title: "Upload Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VStack spacing={4} align="center" width="full">
      {/* Upload Button */}
      <Button
        firstFlow
        size="xs"
        as="label"
        
        variant="solid"
        colorScheme="blue"
        isLoading={isUploading}
        loadingText="Uploading"
        fontSize="xs"
      >
       <AiOutlineUpload /> Update Avatar
        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          display="none"
        />
      </Button>

      {/* Preview the selected image */}
      {previewUrl && (
        <Box boxSize="100px" position="relative">
          <Image
            src={previewUrl}
            alt="Avatar Preview"
            boxSize="100%"
            objectFit="cover"
            borderRadius="full"
            border="2px solid gray"
          />
        </Box>
      )}

      {/* Submit Button */}
      {selectedFile && (
        <Button
          colorScheme="teal"
          size="sm"
          onClick={handleUpload}
          isDisabled={isUploading}
        >
          Save Avatar
        </Button>
      )}
    </VStack>
  );
};

export default AvatarImageUpload;
