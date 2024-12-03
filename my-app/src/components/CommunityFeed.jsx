import React, { useState, useEffect } from "react";
import { supabase } from "../App";
import { Box, Text, VStack } from "@chakra-ui/react";
import Post from "./Posts"; // Import the Post component
import PostsAddDrawer from "./PostsAddDrawer";

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializePosts = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("posts")
          .select(`
            id,
            content,
            image_url,
            created_at,
            user_id,
            author_username,
            parent_post_id,
            posts_reactions (reaction_type, user_id),
            tagged_users (user_id),
            tagged_resources (resource_id, 
            resources (resource_name)),
            profiles (role) 
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        console.error("Error initializing posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch posts initially
    initializePosts();

    // Set up Supabase channel subscription
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            // Add new post to the feed
            setPosts((prevPosts) => [payload.new, ...prevPosts]);
          } else if (payload.eventType === "UPDATE") {
            // Update the post in the feed
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post.id === payload.new.id ? payload.new : post
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Remove the deleted post from the feed
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box 
        p={4}
        maxHeight="1000" overflow="auto" 
         >
        
        <PostsAddDrawer/>
      <VStack spacing={4} align="stretch">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </VStack>
    </Box>
  );
};

export default CommunityFeed;
