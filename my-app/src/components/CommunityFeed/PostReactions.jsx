import React, { useState, useEffect } from "react";
import { supabase } from "@/App"; // Update with your actual path

const PostReactions = ({ postId }) => {
  const [reactions, setReactions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const { data: post, error } = await supabase
          .from("posts")
          .select("reactions")
          .eq("id", postId)
          .single();

        if (error) {
          console.error("Error fetching reactions:", error);
          return;
        }

        setReactions(post.reactions || {});
      } catch (error) {
        console.error("Error loading reactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, [postId]);

  if (loading) {
    return <p>Loading reactions...</p>;
  }

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc", marginTop: "1rem" }}>
      <h4>Reactions</h4>
      {Object.keys(reactions).length === 0 ? (
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
    excited: "🎉",
    celebrate: "🎊",
    impressed: "👏",
    support: "🙌",
  };

  return emojis[reactionType] || "❓"; // Default to a question mark if reaction is unrecognized
};

export default PostReactions;
