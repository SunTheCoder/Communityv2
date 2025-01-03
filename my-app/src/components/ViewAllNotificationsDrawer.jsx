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
  Stack
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from "@/components/ui/drawer";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton"

import { Avatar } from "./ui/avatar";
import { PaginationRoot, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from "@/components/ui/pagination";
import { supabase } from "../App";

const PAGE_SIZE = 10; // Number of notifications per page

const ViewAllNotificationsDrawer = ({ open, onOpenChange, user }) => {
  const userId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0); // Total number of notifications

  const fetchNotifications = async (page) => {
    setLoading(true);
    try {
      // Fetch paginated notifications
      const { data: notificationsData, error: notificationsError, count } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1); // Pagination logic

      if (notificationsError) throw notificationsError;

      // Fetch profiles for notification_by
      const notificationByIds = notificationsData.map((notif) => notif.notification_by);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", notificationByIds);

      if (profilesError) throw profilesError;

      // Map notifications to their corresponding profile data
      const enrichedNotifications = notificationsData.map((notif) => {
        const profile = profilesData.find((profile) => profile.id === notif.notification_by);
        return {
          ...notif,
          profile, // Attach profile data
        };
      });

      setNotifications(enrichedNotifications);
      setTotal(count); // Set total notifications
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && userId) {
      fetchNotifications(page);
    }
  }, [open, userId, page]);

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange} size="sm" placement="top">
      <Portal>
        <DrawerBackdrop />
      </Portal>

      <DrawerContent
        borderBottomRadius="lg"
        border="2px solid"
        borderColor="pink.300"
        borderTop="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
        w="400px"
        maxH="750px"
        ml="100px"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
      >
        <DrawerCloseTrigger />
        <DrawerHeader>
          <Heading size="2xl">All Notifications</Heading>
        </DrawerHeader>

        <DrawerBody>
  {loading ? (
    <VStack align="stretch" spacing={4}>
      {Array.from({
        length: Math.min(PAGE_SIZE, total - (page - 1) * PAGE_SIZE) || 10,
      }).map((_, index) => (
        <HStack key={index} gap="5">
          <SkeletonCircle size="14" />
          <Stack flex="1">
            <Skeleton height="5" />
            <Skeleton height="5" width="80%" />
          </Stack>
        </HStack>
      ))}
    </VStack>
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
          <Avatar size="sm" src={notif.profile?.avatar_url} name={notif.profile?.username} />
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
          <PaginationRoot count={total} pageSize={PAGE_SIZE} page={page} onPageChange={(e) => setPage(e.page)}>
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
          <Button logout variant="outline" mr={3} onClick={() => onOpenChange({ open: false })}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ViewAllNotificationsDrawer;
