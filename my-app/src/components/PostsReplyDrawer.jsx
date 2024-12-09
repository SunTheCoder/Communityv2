import React, { useState, useEffect } from "react";
import { Button, Textarea } from "@chakra-ui/react";
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
import { CloseButton } from "./ui/close-button";
import { Toaster, toaster } from "./ui/toaster";
import { supabase } from "../App";
import { useSelector } from "react-redux";

const PostReplyDrawer = ({ parentPostId, trigger }) => {
  const [replyContent, setReplyContent] = useState("");
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
      <DrawerContent roundedTop="md" width="46.6%" ml="6%" border="2px solid" borderColor="gray.200" borderBottom="none" bg="gray.200" _dark={{borderColor:"pink.600", bg:"gray.900"}}>
        <Toaster />
        <DrawerCloseTrigger>
          <CloseButton />
        </DrawerCloseTrigger>
        <DrawerHeader>
          {parentPostCreator
            ? `Reply to ${parentPostCreator}'s post`
            : "Reply to Post"}
        </DrawerHeader>
        <DrawerBody>
          <Textarea
            placeholder="Write your reply..."
            resize="none"
            value={replyContent}
            bg="gray.100"
            onChange={(e) => setReplyContent(e.target.value)}
            autoFocus
          />
        </DrawerBody>
        <DrawerFooter justify="flex-end" gap={4}>
          <DrawerActionTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => toaster.create({ title: "Canceled", type: "info" })}
              bg="gray.100"
              _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
              shadow="xs"
              size="xs"
              
              >
              Cancel
            </Button>
          </DrawerActionTrigger>
          <DrawerActionTrigger asChild>
            <Button variant="ghost" onClick={handleReplySubmit}  bg="radial-gradient(circle, #FFE4E1, #E6E6FA)"
                _hover={{ bg:"radial-gradient(circle, #E0FFFF, #E6E6FA)"}}
                _dark= {{ bg: "gray.600" } }
                // border="1px solid"
                // borderColor="pink.300"
                shadow="xs"
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
