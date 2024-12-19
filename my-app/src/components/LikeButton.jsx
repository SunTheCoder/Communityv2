import React, { useState } from "react";
import { Button, HStack, Box, Text } from "@chakra-ui/react";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { addLikeToCommFeed } from "../supabaseRoutes";

const LikeButton = ({ postId, initialLikes, userId }) => {
  const [likesCount, setLikesCount] = useState(initialLikes || 0);

  const handleLike = async () => {
    try {
      const response = await addLikeToCommFeed(postId, userId); // Call the Supabase function
      if (response.success) {
        setLikesCount((prev) => prev + 1); // Optimistically update the like count
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  return (
    <Button
      variant="plain"
      height="100%"
      
      onClick={handleLike}
      display="flex"
      alignItems="center"
      position="relative"
      left="52px"
      top="-30px"
    >
      <HStack spacing={2}>
        <Box as={BsHandThumbsUpFill} color="pink.300" height="13px" _hover={{color:"pink.500"}}/>
        <Text>{likesCount}</Text>
      </HStack>
    </Button>
  );
};

export default LikeButton;
