import React, { useState, useEffect } from "react";
import { Box, Text, VStack, HStack, Button, Flex, defineStyle, Separator } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { useSelector } from "react-redux";
import { supabase } from "../App";
import PostReplyDrawer from "./PostsReplyDrawer";

const Post = ({ post }) => {
  const { user } = useSelector((state) => state.user);
  const [parentPost, setParentPost] = useState(null); // State to store parent post content

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  // Fetch the parent post content if parent_post_id is not null
  useEffect(() => {
    const fetchParentPost = async () => {
      if (post.parent_post_id) {
        try {
          const { data, error } = await supabase
            .from("posts")
            .select("content, author_username")
            .eq("id", post.parent_post_id)
            .single();
          if (error) throw error;

          setParentPost(data);
        } catch (error) {
          console.error("Error fetching parent post:", error.message);
        }
      }
    };

    fetchParentPost();
  }, [post.parent_post_id]);

  return (
    <Box
      maxWidth="1200px"
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      mb={4}
      _dark={{ bg: "gray.800" }}
      
      _hover={{ border: "1px solid", borderColor: "gray.700" }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <HStack py={2}>
            {post.user_id === user?.id ? (
              <Avatar
                size="xs"
                src={user?.avatarUrl || "User avatar"}
                alt={user?.username || "User username"}
                colorPalette="pink"
                css={ringCss}
              />
            ) : (
              <Avatar size="xs" />
            )}

            <Text color="gray.700" _dark={{ color: "pink.200" }} fontWeight="semibold">
              {post.author_username}
            </Text>

            {parentPost && (
                <Box
               
              >
                <HStack>
             <Separator orientation="horizontal" size="sm" borderColor="pink.600" width="40px" />
             <Box
              bg="gray.50"
                _dark={{ bg: "gray.700" }}
                p={2}
                borderRadius="md"
                mt={2}
                mb={2}
                fontSize="xs"
                width="400px"
                shadow="sm"
             >
             <Text fontWeight="bold" mb={1}>
             @{parentPost.author_username}
           </Text>
           <Text truncate >{parentPost.content}</Text>
           </Box>
           </HStack>
           </Box>   
            )}
            
          </HStack>
          {post.profiles?.role === "admin" && (
            <Text fontSize="xs" color="red.500" fontWeight="bold">
              Admin
            </Text>
          )}
          <Text fontSize="xs" color="gray.700" _dark={{ color: "pink.200" }}>
            {new Date(post.created_at).toLocaleString().split(",")[0]} at{" "}
            {new Date(post.created_at).toLocaleString().split(",")[1]}
          </Text>
        </Box>
        {/* <Button size="xs" variant="ghost" color="gray.700" _dark={{ color: "pink.200" }}>
          Follow
        </Button> */}
      </Flex>

      {/* If this post is a reply, show truncated parent post content */}
      {/* {parentPost && (
        <Box
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
          p={2}
          borderRadius="md"
          mt={2}
          mb={2}
          fontSize="xs"
        >
          <Text fontWeight="bold" mb={1}>
            Replying to: {parentPost.author_username}
          </Text>
          <Text isTruncated>{parentPost.content}</Text>
        </Box>
      )} */}

      <HStack>
        <Box maxHeight="150px" maxWidth="425px" color="gray.700" _dark={{ color: "pink.200" }}>
          <Text fontSize="xs" mt={2}>
            {post.content}
          </Text>
        </Box>
        {post.image_url && (
          <Box mt={4}>
            <img
              src={post.image_url}
              alt="Post Image"
              style={{ borderRadius: "8px", maxWidth: "100%" }}
            />
          </Box>
        )}
      </HStack>

      {post.tagged_resources?.length > 0 && (
        <VStack align="flex-start" mt={4}>
          <Text fontWeight="bold">Tagged Resources:</Text>
          {post.tagged_resources.map((tagged) => (
            <Text key={tagged.resource_id} fontSize="sm">
              {tagged.resources.resource_name || "Unknown Resource"}
            </Text>
          ))}
        </VStack>
      )}

      <HStack mt={4} spacing={2}>
        {/* <Button size="xs" variant="ghost" color="gray.700" _dark={{ color: "pink.200" }}>
          💬 Reply
        </Button> */}
        <Button size="xs" variant="ghost" color="gray.700" _dark={{ color: "pink.200" }}>
          ❤️ React
        </Button>
        <PostReplyDrawer parentPostId={post.id} />
      </HStack>
    </Box>
  );
};

export default Post;
