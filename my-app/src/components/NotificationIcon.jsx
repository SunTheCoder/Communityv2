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

  return (
    <PopoverRoot positioning={{ placement: "bottom-end" }}>
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
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <VStack align="stretch" spacing={3}>
            {notifications.length === 0 ? (
              <Text textAlign="center">No notifications</Text>
            ) : (
              notifications.map((notif) => (
                <HStack
                  key={notif.id}
                  p="2"
                  borderRadius="md"
                  bg="gray.50"
                  justify="space-between"
                >
                  <Text fontSize="sm">{notif.message}</Text>
                  {!notif.is_read && (
                    <Button
                      size="xs"
                      onClick={() => markAsRead(notif.id)}
                      colorScheme="teal"
                    >
                      Mark as Read
                    </Button>
                  )}
                </HStack>
              ))
            )}
            <Separator mt="2" />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default NotificationIcon;
