import React from "react";
import { Box, Text, VStack, HStack, Button, Flex } from "@chakra-ui/react";

const Post = ({ post }) => {
  return (
    <Box width="550px"p={4} bg="white" borderRadius="md" boxShadow="sm" mb={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text fontWeight="bold">{post.author_username}</Text>
          <Text fontSize="xs" color="gray.500">
            {new Date(post.created_at).toLocaleString().split(",")[0]} at{" "}
            {new Date(post.created_at).toLocaleString().split(",")[1]}
          </Text>
        </Box>
        <Button size="xs" variant="ghost">
          Follow
        </Button>
      </Flex>

      <HStack>
      <Box height="80px"maxWidth="425px">
        <Text fontSize="xs" mt={2}>{post.content}</Text>
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
            <Text key={tagged.resource_id} fontSize="sm" >
              {tagged.resources.resource_name || "Unknown Resource"}
            </Text>
          ))}
        </VStack>
      )}

      {post.posts_comments?.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="bold" mb={2}>
            Comments:
          </Text>
          {post.posts_comments.map((comment) => (
            <Text key={comment.id} fontSize="sm" color="gray.700">
              - {comment.content}
            </Text>
          ))}
        </Box>
      )}

      <HStack mt={4} spacing={2}>
        <Button size="xs" variant="ghost">
          👍 Like
        </Button>
        <Button size="xs" variant="ghost">
          💬 Comment
        </Button>
        <Button size="xs" variant="ghost">
          ❤️ React
        </Button>
      </HStack>
    </Box>
  );
};

export default Post;
