import React, { useState, useEffect } from "react";
import { supabase } from "../App";
import { Box, Text, VStack } from "@chakra-ui/react";
import Post from "./Posts"; // Import the Post component

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("posts")
          .select(`
            id,
            content,
            image_url,
            created_at,
            author_username,
            posts_comments (id, content, user_id),
            posts_reactions (reaction_type, user_id),
            tagged_users (user_id),
            tagged_resources (resource_id, resources (resource_name))
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box p={4}>
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
