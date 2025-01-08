"use client";

import React, { useState } from "react";
import { Box, Button, IconButton, Flex, Tooltip } from "@chakra-ui/react";
import {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card";
import { FaThumbsUp, FaRegLaughSquint, FaLightbulb, FaHeart, FaHandsHelping } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { BsHandThumbsUpFill } from "react-icons/bs";

const reactionIcons = {
    like: <FaThumbsUp color="blue" />,
    love: <FaHeart color="red" />,
    // excited: <FaRegLaughSquint color="orange" />,
    celebrate: <FaHandsClapping color="green" />,
    // impressed: <FaHandsHelping color="purple" />,
    support: <FaHandsHelping color="teal" />,
    laugh: <FaRegLaughSquint color="purple" />,
    idea: <FaLightbulb color="yellow" />,
  };
  
  const reactionLabels = {
    like: "Like",
    love: "Love",
    // excited: "Excited",
    celebrate: "Celebrate",
    // impressed: "Impressed",
    support: "Support",
    laugh: "Laugh",
    idea: "Idea",
  };
  
const ReactionPopover = ({ onReact }) => {
  return (
    <Flex p={0} >
      {Object.entries(reactionIcons).map(([reactionType, icon]) => (
        <Box key={reactionType} label={reactionLabels[reactionType]} >
          <IconButton
            aria-label={reactionType}
        
            onClick={() => onReact(reactionType)}
            variant="ghost"
            size="md"
            borderRadius="4xl"
            _hover={{ transform: "scale(1.2)", bg: "pink.200" }}
          >{icon}</IconButton>
        </Box>
      ))}
    </Flex>
  );
};

const HoverLikeButton = ({ postId, reactorId, addReaction }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleReaction = async (reactionType) => {
    await addReaction(postId, reactorId, reactionType);
    setIsHovering(false); // Close the popover after reacting
  };

  return (
    <HoverCardRoot open={isHovering} onOpenChange={(open) => setIsHovering(open)}>
      <HoverCardTrigger asChild>
        <Button
         variant="ghost"
          borderRadius="4xl"
          _hover={{ bg: "pink.300" }}
          px="7px"
          size="2xs"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
           {/* <Box as={BsHandThumbsUpFill} color="pink.700" height="13px"/> */}
           Like
        </Button>
      </HoverCardTrigger>
      <HoverCardContent         
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
        
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
        
 onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} >
        <HoverCardArrow />
        <ReactionPopover onReact={handleReaction} />
      </HoverCardContent>
    </HoverCardRoot>
  );
};

export default HoverLikeButton;
