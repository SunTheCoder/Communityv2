import React, { useState } from "react";
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

const PostReplyDrawer = ({ parentPostId }) => {
  const [replyContent, setReplyContent] = useState("");
  const { user } = useSelector((state) => state.user);

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
    <DrawerRoot placement="bottom" >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="ghost" >
          💬 Reply
        </Button>
      </DrawerTrigger>
      <DrawerContent
      
      >
        <Toaster />
        <DrawerCloseTrigger>
          <CloseButton />
        </DrawerCloseTrigger>
        <DrawerHeader>Reply to Post</DrawerHeader>
        <DrawerBody>
          <Textarea
            placeholder="Write your reply..."
            resize="none"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            autoFocus
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
          variant="ghost"
          onClick={() => 
            handleReplySubmit()}
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
