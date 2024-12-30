import React, { useState, useEffect } from "react";
import { supabase } from "../../App"; // Adjust this path as needed
import { useSelector } from "react-redux"; // Assuming ZIP code is in Redux state

const AddFriendship = () => {
  const { zipCode, id: currentUserId } = useSelector((state) => state.user?.user); // Assuming Redux stores the logged-in user's info
  const [users, setUsers] = useState([]); // List of users in the same ZIP code
  const [selectedUserId, setSelectedUserId] = useState(""); // Selected user to friend
  const [statusMessage, setStatusMessage] = useState(""); // Display success/error messages
  const [loading, setLoading] = useState(false); // Loading state

  const fetchUsers = async () => {
    try {
      // Fetch all users in the same ZIP code except the current user
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("zip_code", zipCode) // Filter by ZIP code
        .neq("id", currentUserId); // Exclude the current user

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleAddFriend = async () => {
    if (!selectedUserId) {
      setStatusMessage("Please select a user to send a friend request.");
      return;
    }

    setLoading(true);
    setStatusMessage(""); // Clear status message

    try {
      const { error } = await supabase
        .from("friends")
        .insert({
          user_id: currentUserId, // Current user's ID
          friend_id: selectedUserId, // Selected user's ID
          status: "pending",
        });

      if (error) throw error;

      setStatusMessage("Friend request sent successfully!");
    } catch (error) {
      console.error("Error adding friend:", error.message);
      setStatusMessage("Error sending friend request. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zipCode && currentUserId) {
      fetchUsers(); // Fetch users when ZIP code and user ID are available
    }
  }, [zipCode, currentUserId]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Add Friendship</h2>

      {/* Dropdown to select a user */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="userSelect">Select a user to add as a friend:</label>
        <select
          id="userSelect"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {/* Add Friend Button */}
      <button
        onClick={handleAddFriend}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "gray" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Add Friend"}
      </button>

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

export default AddFriendship;
