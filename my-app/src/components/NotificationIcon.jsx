import React, { useState, useEffect } from "react";
import { IconButton, Badge, Box, Circle, Float } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { supabase } from "../App";

const NotificationIcon = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Function to handle events
    const handleEvent = (payload) => {
      console.log("Change received:", payload);
      setNotificationCount((prev) => prev + 1); // Increment the notification count
    };

    // Subscribe to changes in the posts table
    const postsChannel = supabase
      .channel("notifications-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handleEvent
      )
      .subscribe();

    // Subscribe to changes in the friends table
    const friendsChannel = supabase
      .channel("notifications-friends")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        handleEvent
      )
      .subscribe();

    // Subscribe to changes in the resources table
    const resourcesChannel = supabase
      .channel("notifications-resources")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        handleEvent
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(friendsChannel);
      supabase.removeChannel(resourcesChannel);
    };
  }, []);

  return (
    <Box position="relative">
      <IconButton
        
        aria-label="Notifications"
        variant="ghost"
        borderRadius="4xl"
        size="sm"
        onClick={() => setNotificationCount(0)} // Reset count when clicked
      >
        <IoNotificationsOutline/>
      </IconButton>
      {notificationCount > 0 && (
        <Float 
            offsetY="10px" 
            offsetX="7px"
            p="3px"
            colorPalette="teal"
            
            >
          <Circle size="3"  bg="red.500" color="white">
            {notificationCount}
          </Circle>
        </Float>
      )}
    </Box>
  );
};

export default NotificationIcon;
