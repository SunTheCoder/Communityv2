import React, { useState, useEffect } from "react";

const PostReactions = ({ postId, reactions }) => {
    return (
      <div style={{ padding: "1rem", borderTop: "1px solid #ccc", marginTop: "1rem" }}>
        <h4>Reactions</h4>
        {Object.keys(reactions || {}).length === 0 ? (
          <p>No reactions yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            {Object.entries(reactions).map(([reactionType, count]) => (
              <div key={reactionType} style={{ textAlign: "center" }}>
                <span style={{ fontSize: "1.5rem", display: "block" }}>
                  {getReactionEmoji(reactionType)}
                </span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  

// Helper function to display emojis for reactions
const getReactionEmoji = (reactionType) => {
    const emojis = {
        like: "👍",
        love: "❤️",
        excited: "🤩",
        celebrate: "🎉",
        impressed: "👏",
        support: "🙌",
        laugh: "😂",
        idea: "💡",
      };

  return emojis[reactionType] || "❓"; // Default to a question mark if reaction is unrecognized
};

export default PostReactions;
