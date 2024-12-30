import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { VStack, Text, defineStyle } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@supabase/supabase-js";

import { supabase } from "../../App";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "teal",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const FriendAvatarGroup = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.user?.id); // Get the authenticated user's ID

  // Function to fetch initial data
  const fetchFriends = async () => {
    // const userId = (await supabase.auth.getUser()).data?.user?.id; // Get the authenticated user's ID

    if (!userId) {
      setFriends([]);
      setLoading(false);
      return;
    }

    if (!userId) {
      setFriends([]);
      setLoading(false);
      return;
    }
  
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`) // Ensure the authenticated user is part of the friendship
      .eq("status", "accepted"); // Filter for accepted friendships
  
    if (!error) setFriends(data || []);
    setLoading(false);
  };
  

  useEffect(() => {
    const loadFriends = async () => {
      await fetchFriends();
  
      const userId = (await supabase.auth.getUser()).data?.user?.id;
  
      if (!userId) return;
  
      // Subscribe to real-time changes
      const channel = supabase
        .channel("friends-updates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "friends" },
          (payload) => {
            const { new: newFriend, old: oldFriend } = payload;
  
            // Ensure the update involves the authenticated user
            const isRelevant =
              (newFriend?.user_id === userId || newFriend?.friend_id === userId) ||
              (oldFriend?.user_id === userId || oldFriend?.friend_id === userId);
  
            if (!isRelevant) return;
  
            if (payload.eventType === "INSERT") {
              setFriends((prev) => [...prev, newFriend]);
            } else if (payload.eventType === "UPDATE") {
              setFriends((prev) =>
                prev.map((friend) =>
                  friend.id === newFriend.id ? newFriend : friend
                )
              );
            } else if (payload.eventType === "DELETE") {
              setFriends((prev) =>
                prev.filter((friend) => friend.id !== oldFriend.id)
              );
            }
          }
        )
        .subscribe();
  
      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    };
  
    loadFriends();
  }, []);
  

  // Split visible avatars and the extra count
  const visibleFriends = friends.slice(0, 6);
  const extraCount = friends.length > 6 ? friends.length - 6 : 0;

  return (
    <VStack gap="4" position="absolute" top="80px">
      {loading ? (
        // Skeletons for loading state
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} height="50px" width="50px" borderRadius="full" />
        ))
      ) : (
        <>
          {visibleFriends.map((friend) => (
            <Avatar
              key={friend.id}
              size="sm"
              name={friend.name}
              src={friend.avatar_url || ""}
              css={ringCss}
            />
          ))}
          {extraCount > 0 && (
            <Avatar size="sm" name={`+${extraCount}`} fallback={`+${extraCount}`} />
          )}
        </>
      )}
    </VStack>
  );
};

export default FriendAvatarGroup;
