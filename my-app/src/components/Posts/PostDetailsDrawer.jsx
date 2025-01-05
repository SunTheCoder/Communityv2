import React, { useState, useEffect } from "react";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button, Box, Text, VStack, HStack, Image } from "@chakra-ui/react";
import PostReplyDrawer from "./PostsReplyDrawer"; // Reuse existing reply drawer
import { supabase } from "../../App";
import { BiDetail } from "react-icons/bi";
import { Tooltip } from "../ui/tooltip";

const PostDetailsDrawer = ({ user, post, parentPost }) => {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState([]);

  // Fetch replies for the post
  useEffect(() => {
    const fetchReplies = async () => {
      if (post.id) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("parent_post_id", post.id)
          .order("created_at", { ascending: true });

        if (!error) {
          setReplies(data);
        } else {
          console.error("Error fetching replies:", error.message);
        }
      }
    };

    fetchReplies();
  }, [post.id]);

  return (
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="md">
      {/* Drawer Trigger */}
      {user.id !== post.user_id && (
      <Tooltip content="View Details">
      <DrawerTrigger asChild>
        <Button 
        size="xs" 
        variant="ghost"
        position="absolute"
        bottom="24px"
        left="125px"
        borderRadius="4xl" 
        _hover={{bg:"pink.300"}} 
        px="0"
        >
          <BiDetail />
        </Button>
      </DrawerTrigger></Tooltip>
          )}

{user.id === post.user_id && (
    <Tooltip content="View Details">
    <DrawerTrigger asChild>
      <Button 
      size="xs" 
      variant="ghost"
      position="absolute"
      bottom="31px"
      left="200px"
      borderRadius="4xl" 
      _hover={{bg:"pink.300"}} 
      px="0"
      >
        <BiDetail />
      </Button>
    </DrawerTrigger></Tooltip>
)}

      {/* Drawer Content */}
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Post Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {/* Post Content */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" fontSize="md">
              {post.author_username}
            </Text>
            <Text>{post.content}</Text>

            {/* Larger Image */}
            {post.image_url && (
              <Box>
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  borderRadius="lg"
                  maxWidth="100%"
                />
              </Box>
            )}

            {/* Parent Post (if any) */}
            {parentPost && (
              <Box mt={4} p={3} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold" mb={1}>
                  Replying to @{parentPost.author_username}:
                </Text>
                <Text>{parentPost.content}</Text>
              </Box>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <VStack align="start" mt={4} spacing={3}>
                <Text fontWeight="bold">Replies:</Text>
                {replies.map((reply) => (
                  <Box
                    key={reply.id}
                    p={3}
                    borderRadius="md"
                    shadow="sm"
                    bg="gray.50"
                    _dark={{ bg: "gray.800" }}
                  >
                    <Text fontWeight="semibold">@{reply.author_username}</Text>
                    <Text>{reply.content}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <DrawerCloseTrigger asChild>
            <Button variant="outline">Close</Button>
          </DrawerCloseTrigger>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default PostDetailsDrawer;
