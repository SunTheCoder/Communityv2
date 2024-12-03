import React from "react";
import { Box, Text, VStack, HStack, Button, Flex } from "@chakra-ui/react";
import { Avatar } from './ui/avatar';

const Post = ({ post }) => {
  return (
    <Box width="550px"p={4} bg="white" borderRadius="md" boxShadow="sm" mb={4} _dark={{ bg:"gray.800"}}
    _hover={{ transform: "scale(1.25)", border: "1px solid", borderColor: "gray.700"}}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
            <HStack py={2}>
            <Avatar></Avatar>
           
          <Text color="gray.700"_dark={{color:"pink.200"}} fontWeight="bold" >{post.author_username}</Text> 
          </HStack>
          <Text fontSize="xs" color="gray.700"_dark={{color:"pink.200"}}>
            {new Date(post.created_at).toLocaleString().split(",")[0]} at{" "}
            {new Date(post.created_at).toLocaleString().split(",")[1]}
          </Text>
        </Box>
        <Button size="xs" variant="ghost" color="gray.700"_dark={{color:"pink.200"}}>
          Follow
        </Button>
      </Flex>

      <HStack>
      <Box maxHeight="150px"maxWidth="425px" color="gray.700" _dark={{ color:"pink.200"}}>
        <Text fontSize="xs" mt={2}>{post.content} </Text>
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
        <Button size="xs" variant="ghost" color="gray.700" _dark={{color:"pink.200"}}>
          👍 Like
        </Button>
        <Button size="xs" variant="ghost" color="gray.700" _dark={{color:"pink.200"}}>
          💬 Comment
        </Button>
        <Button size="xs" variant="ghost" color="gray.700" _dark={{color:"pink.200"}}>
          ❤️ React
        </Button>
      </HStack>
    </Box>
  );
};

export default Post;
