import React, { useState, useEffect } from "react";
import { supabase } from "../App";
import { Box, Text, VStack } from "@chakra-ui/react";
import Post from "./Posts"; // Import the Post component
import PostsAddDrawer from "./PostsAddDrawer";
import ResourcePostsAddDrawer from "./ResourcePostsAddDrawer";
import ResourcePost from "./ResourcePosts";


const ResourceFeed = ({ resourceId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializePosts = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("resource_posts")
          .select(`
            id,
            content,
            image_url,
            created_at,
            user_id,
            author_username,
            resource_id,
            parent_post_id,
            profiles (role)
          `)
          .eq("resource_id", resourceId) // Filter by resource_id
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        console.error("Error initializing posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      initializePosts();
    }

    // Set up Supabase channel subscription for real-time updates
    const channel = supabase
      .channel("realtime:resource_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resource_posts" },
        (payload) => {
          if (payload.new.resource_id === resourceId) {
            if (payload.eventType === "INSERT") {
              setPosts((prevPosts) => [payload.new, ...prevPosts]);
            } else if (payload.eventType === "UPDATE") {
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === payload.new.id ? payload.new : post
                )
              );
            } else if (payload.eventType === "DELETE") {
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== payload.old.id)
              );
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [resourceId]);

  return (
    <Box maxHeight="1000" overflow="auto" ml={6}>
      <Box pl="8px">
        <ResourcePostsAddDrawer resourceId={resourceId} />
      </Box>
      <VStack spacing={4} align="stretch">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          posts.map((post) => <ResourcePost key={post.id} post={post} />)
        )}
      </VStack>
    </Box>
  );
};

export default ResourceFeed;

