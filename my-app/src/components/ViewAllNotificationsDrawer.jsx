import React, { useEffect, useState } from "react";
import {
  VStack,
  Box,
  Text,
  Spinner,
  Button,
  Portal,
  HStack,
  Heading,
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Avatar } from "./ui/avatar";
import { supabase } from "../App";

const ViewAllNotificationsDrawer = ({ open, onOpenChange, user }) => {
  const userId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
  
      if (notificationsError) throw notificationsError;
  
      // Step 2: Fetch profiles for notification_by
      const notificationByIds = notificationsData.map((notif) => notif.notification_by);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", notificationByIds);
  
      if (profilesError) throw profilesError;
  
      // Step 3: Map notifications to their corresponding profile data
      const enrichedNotifications = notificationsData.map((notif) => {
        const profile = profilesData.find((profile) => profile.id === notif.notification_by);
        return {
          ...notif,
          profile, // Attach the corresponding profile data
        };
      });
  
      setNotifications(enrichedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (open && userId) {
      fetchNotifications();
    }
  }, [open, userId]);

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange} size="md">
      <Portal>
      <DrawerBackdrop />
       </Portal>
      
      <DrawerContent 
        borderLeftRadius="lg"
        border="2px solid"
        borderColor="pink.300"
        borderRight="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
      
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
      >
        <DrawerCloseTrigger />
        <DrawerHeader>
          
          <Heading
            size="2xl"
          >All Notifications</Heading>


        </DrawerHeader>

        <DrawerBody>
          {loading ? (
            <Spinner size="lg" />
          ) : notifications.length === 0 ? (
            <Text>No notifications available.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
  {notifications.map((notif) => (
    <HStack
      key={notif.id}
      p="4px"
      bg="radial-gradient(circle,rgb(222, 179, 172),rgb(230, 190, 240))"
      _dark={{
        borderColor: "pink.600",
        bg: "radial-gradient(circle,rgb(99, 46, 65),rgb(24, 23, 29))",
      }}
      borderRadius="md"
      shadow="sm"
      align="center"
      spacing={3}
      
    >
      <Avatar
        size="sm"
        src={notif.profile?.avatar_url}
        name={notif.profile?.username}
      />
      <VStack align="flex-start" spacing={0}>
        <Text textStyle="sm" color="pink.900">
          <strong>{notif.profile?.username}</strong> liked your post!
        </Text>
        <Text textStyle="xs" color="pink.900">
          {new Date(notif.created_at).toLocaleString()}
        </Text>
      </VStack>
    </HStack>
  ))}
</VStack>

          )}
        </DrawerBody>

        <DrawerFooter>
          <Button logout variant="outline" mr={3} onClick={() => onOpenChange({ open: false })}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ViewAllNotificationsDrawer;
