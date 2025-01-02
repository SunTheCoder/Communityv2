import React, { useState, useEffect } from "react";
import { supabase } from "../../App"; // Adjust this path as needed
import { useSelector } from "react-redux"; // Assuming user data is in Redux

const PendingRequests = () => {
  const { id: currentUserId } = useSelector((state) => state.user?.user); // Get current user ID from Redux
  const [pendingRequests, setPendingRequests] = useState([]); // Store pending requests
  const [statusMessage, setStatusMessage] = useState(""); // Feedback messages
  const [loading, setLoading] = useState(false); // Loading state for actions

  const fetchPendingRequests = async () => {
    try {
      // Fetch pending requests where the logged-in user is the friend_id
      const { data, error } = await supabase
      .from("friends")
      .select("id, user_id, profiles:profiles!user_id(username)") // Explicit relationship for 'user_id'
      .eq("friend_id", currentUserId)
      .eq("status", "pending");

      if (error) throw error;

      setPendingRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error.message);
    }
  };

  const handleAction = async (friendshipId, newStatus) => {
    setLoading(true);
    setStatusMessage(""); // Clear status message

    try {
      const { error } = await supabase
        .from("friends")
        .update({ status: newStatus }) // Update friendship status
        .eq("id", friendshipId)

      if (error) throw error;

      console.log("new status for friendship ID:", friendshipId, "to:", newStatus);

      setStatusMessage(
        `Friend request ${
          newStatus === "accepted" ? "approved" : "declined"
        } successfully!`
      );

      // Refresh the pending requests list
      fetchPendingRequests();
    } catch (error) {
      console.error("Error updating friendship status:", error.message);
      setStatusMessage("Error processing request. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchPendingRequests(); // Fetch requests when the component loads
    }
  }, [currentUserId]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Pending Friend Requests</h2>

      {pendingRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {pendingRequests.map((request) => (
            <li
              key={request.id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>{request.profiles.username}</strong> sent you a friend
                request.
              </p>
              <div>
                <button
                  onClick={() => handleAction(request.id, "accepted")}
                  disabled={loading}
                  style={{
                    marginRight: "10px",
                    padding: "8px 15px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(request.id, "declined")}
                  disabled={loading}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Processing..." : "Decline"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div
          style={{
            marginTop: "15px",
            color: statusMessage.includes("Error") ? "red" : "green",
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
