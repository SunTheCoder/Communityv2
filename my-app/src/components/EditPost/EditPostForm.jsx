import React, { useState } from "react";
import { toaster } from "../ui/toaster";
import DynamicUploadImage from "../CommunityFeed/DynamicUploadImage";
import { Button } from "@/components/ui/button"; // Adjust path to your Button component
import { Tooltip } from "../ui/tooltip";
import { uploadImage } from "../../supabaseRoutes/storage/uploadImage";
import { getPublicUrl } from "../../supabaseRoutes/storage/getPublicUrl";
import { supabase } from "@/App";
import { Field } from "../ui/field";
import { Box, HStack, Textarea } from "@chakra-ui/react";

const EditPostForm = ({ postId, currentContent, currentImageUrl, onClose }) => {
  const [content, setContent] = useState(currentContent || "");
  const [selectedFile, setSelectedFile] = useState(null); // For the uploaded file
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = currentImageUrl;

      // Upload the selected file using the helper function
      if (selectedFile) {
        const filePath = await uploadImage(selectedFile, "images", `posts/${postId}`);
        if (!filePath) throw new Error("Failed to upload image.");
        imageUrl = getPublicUrl(filePath, "images");
      }

      // Update the post in Supabase
      const { error: updateError } = await supabase
        .from("posts")
        .update({ content: content.trim(), image_url: imageUrl || null })
        .eq("id", postId);

      if (updateError) throw updateError;

      toaster.create({
        description: "Post updated successfully!",
        type: "success",
        duration: 5000,
      });

      onClose && onClose(); // Close the drawer after success
    } catch (err) {
      console.error("Error updating post:", err.message);
      toaster.create({
        title: "Error Updating Post. Please try again.",
        description: err.message,
        type: "error",
        duration: 5000,
      });
      setError(err.message);
      setSelectedFile(null); // Clear the selected file after error to prevent duplicates
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Post">
        
        <Textarea
          id="post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your post content"
          required
        />
      </Field>

      <HStack mt="10px">
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
        <DynamicUploadImage onFileSelect={handleFileSelect} clearPreview={!selectedFile} />

      
    </Button></Tooltip>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <Button login size="xs" type="submit">
        Save Changes
      </Button>
      </HStack>

    </form>
  );
};

export default EditPostForm;
