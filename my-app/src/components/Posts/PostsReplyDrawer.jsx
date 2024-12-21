import React, { useState, useEffect } from "react";
import { Button, Textarea, VStack } from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerActionTrigger,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "../ui/drawer";
import { Toaster, toaster } from "../ui/toaster";
import { supabase } from "../../App";
import { useSelector } from "react-redux";
import DynamicUploadImage from "../CommunityFeed/DynamicUploadImage"; // Import the DynamicUploadImage component

const PostReplyDrawer = ({ parentPostId, trigger }) => {
  const [replyContent, setReplyContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // Store uploaded image URL
  const [parentPostCreator, setParentPostCreator] = useState(null); // Store parent post creator's name
  const { user } = useSelector((state) => state.user);

  // Fetch the parent post creator
  useEffect(() => {
    const fetchParentPostCreator = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("author_username")
          .eq("id", parentPostId)
          .single();

        if (error) throw error;
        setParentPostCreator(data.author_username);
      } catch (error) {
        console.error("Error fetching parent post creator:", error.message);
      }
    };

    if (parentPostId) {
      fetchParentPostCreator();
    }
  }, [parentPostId]);

  const handleReplySubmit = async () => {
    try {
      if (!user) {
        throw new Error("User not logged in. Please log in to reply.");
      }

      if (!replyContent.trim()) {
        toaster.create({
          title: "Reply content is required",
          type: "error",
        });
        return;
      }

      const { error } = await supabase.from("posts").insert([
        {
          content: replyContent.trim(),
          image_url: imageUrl, // Attach the uploaded image URL to the reply
          parent_post_id: parentPostId,
          author_username: user.username,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toaster.create({
        description: "Reply submitted successfully!",
        type: "success",
      });

      setReplyContent(""); // Clear the reply content
      setImageUrl(null); // Clear the uploaded image URL
    } catch (error) {
      console.error("Error submitting reply:", error.message);
      toaster.create({
        title: "Error Submitting Reply",
        description: error.message,
        type: "error",
      });
    }
  };

  return (
    <DrawerRoot placement="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent
        roundedTop="md"
        width="48%"
        ml="6%"
        border="2px solid"
        borderColor="pink.300"
        borderBottom="none"
        bg="radial-gradient(circle, #FFE4E1, #F6E6FA)"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle, #8B4A62, #2C2A35)",
        }}
      >
        <Toaster />
        <DrawerCloseTrigger />
        <DrawerHeader
          fontWeight="semibold"
          color="gray.800"
          _dark={{ color: "pink.200" }}
        >
          {parentPostCreator
            ? `Reply to ${parentPostCreator}`
            : "Reply to Post"}
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {/* Reply Content */}
            <Textarea
              placeholder="Write your reply..."
              resize="none"
              value={replyContent}
              bg="gray.100"
              onChange={(e) => setReplyContent(e.target.value)}
              shadow="xs"
              _focus={{
                outlineColor: "pink.300",
                outlineOffset: "3px",
                outlineWidth: "2px",
                border: "none",
                shadow: "xs",
              }}
              _dark={{
                outlineColor: "pink.300",
                color: "pink.900",
                bg: "gray.200",
              }}
            />

            {/* Image Upload */}
            <DynamicUploadImage
              uploadType="reply_images" // Specify the folder for replies
              onUploadComplete={(url) => setImageUrl(url)} // Set the uploaded image URL
            />
          </VStack>
        </DrawerBody>
        <DrawerFooter justify="flex-end" gap={4}>
          <DrawerActionTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => toaster.create({ title: "Canceled", type: "info" })}
              bg="gray.100"
              _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
              shadow="sm"
              size="xs"
              _dark={{ bg: "gray.500", color: "pink.200" }}
            >
              Cancel
            </Button>
          </DrawerActionTrigger>
          <DrawerActionTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleReplySubmit}
              bg="radial-gradient(circle, #FFE4E1, #E6E6FA)"
              _hover={{ bg: "radial-gradient(circle, #E0FFFF, #E6E6FA)" }}
              _dark={{
                bg: "radial-gradient(circle, #8B4A62, #2C2A35)",
                _hover: {
                  bg: "radial-gradient(circle, #4A708B, #2C2A35)",
                  color: "pink.200",
                },
              }}
              shadow="sm"
              size="xs"
            >
              Submit
            </Button>
          </DrawerActionTrigger>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default PostReplyDrawer;
