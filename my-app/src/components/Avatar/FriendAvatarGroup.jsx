import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { VStack, defineStyle } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";

import { supabase } from "../../App";
import { px } from "framer-motion";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "teal",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const FriendAvatarGroup = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's ID from Redux
  const userId = useSelector((state) => state.user?.user?.id);

  // Fetch friends and their profiles
  const fetchFriends = async () => {
    if (!userId) {
      setFriends([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
    .from("friends")
    .select(`
      id,
      user_id,
      friend_id,
      status,
      profiles:user_id!inner(username, avatar_url),
      friend_profiles:friend_id!inner(username, avatar_url)
    `)
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted");
  

    if (error) {
      console.error("Error fetching friends:", error);
      setFriends([]);
    } else {
      setFriends(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadFriends = async () => {
      await fetchFriends();

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
  }, [userId]);

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
          {visibleFriends.map((friend) => {
            // Determine the friend's profile details
            const isSender = friend.user_id === userId;
            const friendProfile = isSender ? friend.friend_profiles : friend.profiles;

            return (
              <Tooltip
                ids={{trigger: friend.id}}
                content={`${friendProfile?.username || "Unknown"} is online`} // Tooltip Content
                
                positioning={{ placement: "right-end", offset: { mainAxis: 20, crossAxis: -5 }  }}
              >
                <Avatar
                ids={{ root: friend.id }}
                  size="sm"
                  name={friendProfile?.username || "Unknown"}
                  src={friendProfile?.avatar_url || ""}
                  css={ringCss}
                />
              </Tooltip>
            );
          })}
          {extraCount > 0 && (
            <Tooltip content={`+${extraCount} more friends`}>
              <Avatar
                size="sm"
                name={`+${extraCount}`}
                fallback={`+${extraCount}`}
              />
            </Tooltip>
          )}
        </>
      )}
    </VStack>
  );
};

export default FriendAvatarGroup;
