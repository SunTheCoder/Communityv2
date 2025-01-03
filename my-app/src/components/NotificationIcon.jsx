import React, { useState, useEffect } from "react";
import { supabase } from "../App";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Circle, VStack, Text, HStack, Separator } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";

const NotificationIcon = ({ user }) => {
  const userId = user?.id;
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data);
      setNotificationCount(data.filter((notif) => !notif.is_read).length);
    };

    fetchNotifications();

    const handleEvent = (payload) => {
      if (payload.new.user_id !== userId) return;

      if (payload.eventType === "INSERT") {
        setNotifications((prev) => [payload.new, ...prev]);
        setNotificationCount((prev) => prev + 1);
      } else if (payload.eventType === "UPDATE") {
        if (payload.new.is_read) {
          setNotificationCount((prev) => Math.max(prev - 1, 0));
        }
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === payload.new.id ? payload.new : notif
          )
        );
      }
    };

    const notificationsChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        handleEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [userId]);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error marking all notifications as read:", error);
    } else {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setNotificationCount(0);
    }
  };

  return (
    <PopoverRoot positioning={{ placement: "bottom-end" }} >
    <PopoverTrigger asChild>
      <Button size="sm" px="2px" variant="outline" position="relative">
        <IoNotificationsOutline />
        {notificationCount > 0 && (
          <Circle
            size="20px"
            fontSize="12px"
            bg="red.500"
            color="white"
            ml="-10px"
            mt="-10px"
            position="absolute"
            left="32px"
            bottom="18px"
          >
            {notificationCount}
          </Circle>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent
      maxW="350px"
      maxH="400px"
      overflow="hidden" // Prevents scrollbars from breaking the border radius
      borderRadius="md"
      p="0" // Remove default padding
      bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
      

    >
      <PopoverArrow />
      <PopoverBody p="4" overflowY="auto" maxH="350px">
        <VStack align="stretch" spacing={3}>
          {notifications.length === 0 ? (
            <Text textAlign="center">No notifications</Text>
          ) : (
            <>
              {/* Show only the latest 10 notifications */}
              {notifications.slice(0, 10).map((notif) => (
                <HStack
                  key={notif.id}
                  p="2"
                  borderRadius="md"
                 
                  _dark={{ bg: "gray.700" }}
                  justify="space-between"
                  bg="radial-gradient(circle,rgb(222, 179, 172),rgb(216, 160, 230))"

                >
                  <Text fontSize="sm">{notif.message}</Text>
                  {!notif.is_read && (
                    <Button
                      firstFlow
                      size="xs"
                      onClick={() => markAsRead(notif.id)}
                      colorScheme="teal"
                    >
                      Mark as Read
                    </Button>
                  )}
                </HStack>
              ))}
              <Separator mt="2" />
              <VStack>
              {/* "Mark All as Read" Button */}
              {notificationCount > 0 && (
                <Button
                  firstFlow
                  size="sm"
                  variant="outline"
                  onClick={() => markAllAsRead()}
                >
                  Mark All as Read
                </Button>
              )}
              {/* "View All" Button */}
              <Button
              firstFlow
                size="sm"
                variant="link"
                onClick={() => console.log("Navigate to all notifications page")}
              >
                View All Notifications
              </Button>
              </VStack>
            </>
          )}
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </PopoverRoot>
  

  );
};

export default NotificationIcon;
