import React, { useState } from "react";
import { Button, Textarea, Input } from "@chakra-ui/react";
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
} from "./ui/drawer";
import { Tooltip } from "./ui/tooltip";
import { CloseButton } from "./ui/close-button";
import { Toaster, toaster } from "./ui/toaster";
import { supabase } from "../App";
import { useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";


const PostsAddDrawer = () => {
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Optional image URL
  const { user } = useSelector((state) => state.user);

  const handlePostSubmit = async () => {
    try {
      if (!user) {
        throw new Error("User not logged in. Please log in to create a post.");
      }

      if (!postContent.trim()) {
        toaster.create({
          title: "Post content is required",
          type: "error",
        });
        return;
      }

      const { error } = await supabase.from("posts").insert([
        {
          content: postContent.trim(),
          image_url: imageUrl || null,
          author_username: user.username,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toaster.create({
        description: "Post created successfully!",
        type: "success",
      });

      // Clear inputs
      setPostContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Error creating post:", error.message);
      toaster.create({
        title: "Error Creating Post",
        description: error.message,
        type: "error",
      });
    }
  };

  return (
    <DrawerRoot placement="bottom">
      <DrawerBackdrop />
      <Tooltip  content="Add Post" positioning={{ placement: "right" }}>
      <DrawerTrigger asChild>
        <Button variant="plain" py="10px" position="relative" left="1px">
          {/* + Add Post */}
          <CiCirclePlus />

        </Button>
      </DrawerTrigger>
        </Tooltip>
      <DrawerContent>
        <Toaster />
        <DrawerCloseTrigger>
          <CloseButton />
        </DrawerCloseTrigger>
        <DrawerHeader>Create a New Post</DrawerHeader>
        <DrawerBody>
          <Textarea
            placeholder="Write your post content..."
            resize="none"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            autoFocus
          />
          <Input
            mt={4}
            placeholder="Optional: Add an image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DrawerBody>
        <DrawerFooter justify="flex-end" gap={4}>
          <DrawerActionTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => toaster.create({ title: "Canceled", type: "info" })}
            >
              Cancel
            </Button>
          </DrawerActionTrigger>
          <DrawerActionTrigger asChild>
            <Button 
                variant="solid"                 
                _hover={{ bg: "green.600", _dark: { bg: "gray.600" } }}
                onClick={handlePostSubmit}
                bg="green.500"
                    
                >
              Submit
            </Button>
          </DrawerActionTrigger>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default PostsAddDrawer;
