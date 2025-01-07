import React, { useState } from "react";
import { addReactionToCommFeed } from "../../supabaseRoutes/supabaseRoutes"; // Update with the actual path

const AddReaction = ({ postId, reactorId }) => {
  const [reactionType, setReactionType] = useState(""); // Stores the selected reaction type
  const [message, setMessage] = useState(""); // Feedback message to display

  const handleReaction = async () => {
    if (!reactionType) {
      setMessage("Please select a reaction type.");
      return;
    }

    const response = await addReactionToCommFeed(postId, reactorId, reactionType);

    if (response.success) {
      setMessage("Reaction added successfully!");
    } else {
      setMessage(`Error: ${response.message}`);
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h3>Add Reaction</h3>

      <label htmlFor="reaction">Select a reaction:</label>
      <select
        id="reaction"
        value={reactionType}
        onChange={(e) => setReactionType(e.target.value)}
      >
        <option value="">--Choose--</option>
        <option value="like">👍 Like</option>
        <option value="love">❤️ Love</option>
        <option value="excited">🎉 Excited</option>
        <option value="celebrate">🎊 Celebrate</option>
        <option value="impressed">👏 Impressed</option>
        <option value="support">🙌 Support</option>
      </select>

      <button
        onClick={handleReaction}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Add Reaction
      </button>

      {message && <p style={{ marginTop: "1rem", color: "blue" }}>{message}</p>}
    </div>
  );
};

export default AddReaction;
