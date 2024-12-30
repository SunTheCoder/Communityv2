import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VStack, Skeleton, defineStyle} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { fetchFriends } from "../../redux/friendSlice";

const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "teal",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

const FriendAvatarGroup = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?.id); // Get logged-in user's ID
  const { list: friends, status } = useSelector((state) => state.friends);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFriends(userId));
    }
  }, [userId, dispatch]);

  const loading = status === "loading";

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
