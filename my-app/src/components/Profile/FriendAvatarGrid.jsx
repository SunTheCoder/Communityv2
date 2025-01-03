import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/friendSlice";
import { VStack, Grid, Box, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
    HoverCardArrow,
    HoverCardContent,
    HoverCardRoot,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { Tooltip } from "../ui/tooltip";

const FriendAvatarGrid = () => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((state) => state.user?.user);
  const { list: friends, status } = useSelector((state) => state.friends);

  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }


  useEffect(() => {
    if (userId) {
      dispatch(fetchFriends(userId));
    }
  }, [userId, dispatch]);

  const isLoading = status === "loading";

  // Split the list of friends to show avatar data
  const visibleFriends = friends.map((friend) => {
    const isSender = friend.user_id === userId;
    return isSender ? friend.friend_profiles : friend.profiles;
  });

  return (
    <VStack align="stretch" spacing={4} mb="25px">
      <Text fontWeight="bold" fontSize="lg">
        Your Friends
      </Text>
      <Grid templateColumns="repeat(auto-fill, minmax(60px, 1fr))" gap={4}  >
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Box key={index} width="60px" height="60px" bg="gray.200" borderRadius="full" />
            ))
          : visibleFriends.map((friend) => (
              <Box key={friend.id} textAlign="center">
               
    <Avatar 
        size="md" 
        src={friend.avatar_url} 
        name={friend.username} 
        colorPalette={pickPalette(friend.username)}

    />

            <Text
                fontSize="xs"
            >{friend.username}</Text>
             
              </Box>
            ))}
      </Grid>
    </VStack>
  );
};

export default FriendAvatarGrid;
