import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaRegLaughSquint, FaLightbulb, FaHeart, FaHandsHelping } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";

const PostReactions = ({ postId, reactions }) => {

    const totalCount = Object.values(reactions || {}).reduce((sum, count) => sum + count, 0);

    return (
      <Box >
        {/* <h4>Reactions</h4> */}
        {Object.keys(reactions || {}).length === 0 ? (
          <p>No reactions yet.</p>
        ) : (
          <Box position="absolute" left= "85px" display= "flex" alignItems="center" gap="2px">
            {Object.entries(reactions).map(([reactionType, count]) => (
              <Box key={reactionType} style={{ textAlign: "center" }}>
                <Box style={{ fontSize: ".8rem"}}>
                  {getReactionEmoji(reactionType)}
                </Box>
                {/* <Text textStyle="2xs">{count}</Text> */}
              </Box>
            ))}
               <Text fontSize="sm" fontWeight="bold" ml="0.5rem">
           {totalCount}
          </Text>
          </Box>
        )}
      </Box>
    );
  };
  

// Helper function to display emojis for reactions
const getReactionEmoji = (reactionType) => {
    const emojis = {
        
            like: <FaThumbsUp color="blue" />,
            love: <FaHeart color="red" />,
            // excited: <FaRegLaughSquint color="orange" />,
            celebrate: <FaHandsClapping color="green" />,
            // impressed: <FaHandsHelping color="purple" />,
            support: <FaHandsHelping color="teal" />,
            laugh: <FaRegLaughSquint color="purple" />,
            idea: <FaLightbulb color="orange" />,
          
      };

  return emojis[reactionType] || "❓"; // Default to a question mark if reaction is unrecognized
};

export default PostReactions;
