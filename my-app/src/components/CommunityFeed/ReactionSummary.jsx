import React from "react";
import { Box, HStack, Text, Avatar, Icon } from "@chakra-ui/react";
import { FaThumbsUp, FaHeart, FaRegLaughSquint, FaLightbulb, FaHandsHelping } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";

const reactionIcons = {
  like: <FaThumbsUp color="blue" />,
  love: <FaHeart color="red" />,
  laugh: <FaRegLaughSquint color="orange" />,
  idea: <FaLightbulb color="teal" />,
  support: <FaHandsHelping color="purple" />,
  celebrate: <FaHandsClapping color="green" />,
};

const ReactionSummary = ({ reactions }) => {
  const totalReactions = Object.values(reactions).reduce((acc, count) => acc + count, 0);

  return (
    <HStack align="center">
      {Object.entries(reactions).map(([reactionType, count]) => (
        <Icon
          key={reactionType}
        
          size="sm"
          bg="white"
          borderWidth="1px"
          borderColor="gray.300"
        >{reactionIcons[reactionType]}</Icon>
      ))}
      <Text fontWeight="bold" ml={2}>{totalReactions}</Text>
    </HStack>
  );
};

export default ReactionSummary;