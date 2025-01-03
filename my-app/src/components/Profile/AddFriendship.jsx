import React, { useState, useEffect, useRef  } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../App";
import { VStack, Grid, Box, Text, Button } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";

const AddFriendship = () => {
  const { zipCode, id: currentUserId } = useSelector((state) => state.user?.user);
  const friends = useSelector((state) => state.friends.list);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const containerRef = useRef(null); // Ref for the grid container


  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setSelectedUser(null); // Deselect user if clicking outside the container
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("zip_code", zipCode)
        .neq("id", currentUserId);

      if (usersError) throw usersError;

      const friendIds = new Set(
        friends.flatMap((friend) =>
          friend.user_id === currentUserId
            ? friend.friend_id
            : friend.user_id
        )
      );

      const filteredUsers = usersData.filter((user) => !friendIds.has(user.id));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleAddFriend = async () => {
    if (!selectedUser) {
      setStatusMessage("Please select a user to send a friend request.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      const { error } = await supabase
        .from("friends")
        .insert({
          user_id: currentUserId,
          friend_id: selectedUser.id,
          status: "pending",
        });

      if (error) throw error;

      setStatusMessage("Friend request sent successfully!");
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id)); // Remove the user from the grid
      setSelectedUser(null); // Reset selection
    } catch (error) {
      console.error("Error adding friend:", error.message);
      setStatusMessage("Error sending friend request. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zipCode && currentUserId) {
      fetchUsers();
    }
  }, [zipCode, currentUserId]);

  return (
    <VStack align="stretch" spacing={4} p="4" maxWidth="600px" m="auto">
      <Text fontWeight="bold" fontSize="lg">
        Add New Friends
      </Text>
      <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={4}  >
        {users.length === 0 && !loading ? (
          <Text>No users available to add as friends.</Text>
        ) : (
          users.map((user) => (
            <Box key={user.id} position="relative" ref={containerRef}>
              <VStack>
              <Avatar
  size="md"
  src={user.avatar_url}
  name={user.username}
  onClick={() =>
    setSelectedUser((prev) => (prev?.id === user.id ? null : user))
  } // Select or deselect user on click
  css={
    selectedUser?.id === user.id
      ? {
          outline: "2px solid teal",
          outlineOffset: "2px",
        }
      : {}
  }
/>
              <Text fontSize="xs" >
                {user.username}
              </Text></VStack>
            </Box>
          ))
        )}
      </Grid>
      <Button
        mt="4"
        login
        size="xxs"
        onClick={handleAddFriend}
        isLoading={loading}
        disabled={!selectedUser}
      >
        Add Friend
      </Button>
      {statusMessage && (
        <Box
          mt="4"
          color={statusMessage.includes("Error") ? "red.500" : "green.500"}
        >
          {statusMessage}
        </Box>
      )}
    </VStack>
  );
};

export default AddFriendship;
