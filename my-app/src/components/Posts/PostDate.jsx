import React from "react";
import { Text, Box } from "@chakra-ui/react";

const formatDate = (createdAt) => {
  const postDate = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    postDate.getDate() === today.getDate() &&
    postDate.getMonth() === today.getMonth() &&
    postDate.getFullYear() === today.getFullYear();

  const isYesterday =
    postDate.getDate() === yesterday.getDate() &&
    postDate.getMonth() === yesterday.getMonth() &&
    postDate.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return "Today";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return postDate.toLocaleDateString(); // Default date format
  }
};

const PostDate = ({ createdAt }) => {
  return (
    
    <Text fontSize="xs" color="gray.700" _dark={{ color: "pink.200" }}>
      {formatDate(createdAt)} at {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    
  );
};

export default PostDate;
