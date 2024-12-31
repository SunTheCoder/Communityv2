import React, { useState, useEffect } from "react";
import { IconButton, Box, Circle, Float } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { supabase } from "../App";

const NotificationIcon = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Function to fetch unread notifications initially
    const fetchUnreadNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id")
        .eq("is_read", false); // Fetch only unread notifications

      if (error) {
        console.error("Error fetching unread notifications:", error);
        return;
      }

      setNotificationCount(data.length); // Set the initial count
    };

    fetchUnreadNotifications();

    // Function to handle real-time updates
    const handleEvent = (payload) => {
      console.log("Notification change received:", payload);

      if (payload.eventType === "INSERT") {
        setNotificationCount((prev) => prev + 1); // Increment count for new notifications
      } else if (payload.eventType === "UPDATE") {
        if (payload.new.is_read) {
          setNotificationCount((prev) => Math.max(prev - 1, 0)); // Decrement count for read notifications
        }
      }
    };

    // Subscribe to changes in the notifications table
    const notificationsChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        handleEvent
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(notificationsChannel);
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
        <IoNotificationsOutline />
      </IconButton>
      {notificationCount > 0 && (
        <Float offsetY="10px" offsetX="7px" p="3px" colorPalette="teal">
          <Circle size="4" fontSize="12px"
          bg="red.500" color="white">
            {notificationCount}
          </Circle>
        </Float>
      )}
    </Box>
  );
};

export default NotificationIcon;
