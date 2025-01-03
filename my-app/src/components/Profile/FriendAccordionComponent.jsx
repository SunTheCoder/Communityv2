import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/friendSlice";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { VStack, HStack, Badge, Text, Box } from "@chakra-ui/react";
import { LuTrophy } from "react-icons/lu";

const FriendAccordionList = () => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((state) => state.user?.user);
  const { list: friends, status } = useSelector((state) => state.friends);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFriends(userId));
    }
  }, [userId, dispatch]);

  const isLoading = status === "loading";

  const visibleFriends = friends.map((friend) => {
    const isSender = friend.user_id === userId;
    return isSender ? friend.friend_profiles : friend.profiles;
  });

  return (
    <AccordionRoot collapsible>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionItemTrigger>
                <HStack spacing={3}>
                  <Box width="40px" height="40px" bg="gray.200" borderRadius="full" />
                  <Text fontSize="md">Loading...</Text>
                </HStack>
              </AccordionItemTrigger>
            </AccordionItem>
          ))
        : visibleFriends.map((friend) => (
            <AccordionItem key={friend.id} value={friend.id}>
              <AccordionItemTrigger>
                <HStack spacing={3}>
                  <Avatar src={friend.avatar_url} name={friend.username} size="md" />
                  <Text fontSize="md">{friend.username}</Text>
                  <Badge colorScheme="green" ml="auto">
                    <LuTrophy /> Top Rated
                  </Badge>
                </HStack>
              </AccordionItemTrigger>
              <AccordionItemContent>
                <VStack align="start" spacing={2} mt={2}>
                  
                  <Text fontSize="sm">{friend.bio}</Text>
                </VStack>
              </AccordionItemContent>
              
            </AccordionItem>
          ))}
    </AccordionRoot>
  );
};

export default FriendAccordionList;
