import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../App";
import { Box, Text, VStack, Separator, Button, HStack, Circle, Center } from "@chakra-ui/react";
import Post from "../Posts/Posts"; // Import the Post component
import PostsAddDrawer from "../Posts/PostsAddDrawer";
import AddPostInput from "./AddPostInput";

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // For initial fetch
  const [loadingMore, setLoadingMore] = useState(false); // For lazy loading
  const [hasMore, setHasMore] = useState(true); // Track if more posts are available

  const loadMoreRef = useRef(); // Ref for the scroll trigger

  // Fetch initial 25 posts
  const fetchInitialPosts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          likes_count,
          user_id,
          author_username,
          parent_post_id,
          posts_reactions (reaction_type, user_id),
          tagged_users (user_id),
          tagged_resources (resource_id, resources (resource_name)),
          profiles (role)
        `)
        .order("created_at", { descending: true })
        .limit(100); // Fetch the first 25 posts

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching initial posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch older posts for lazy loading
  const fetchOlderPosts = async (lastDate) => {
    try {
      setLoadingMore(true);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          likes_count,
          user_id,
          author_username,
          parent_post_id,
          posts_reactions (reaction_type, user_id),
          tagged_users (user_id),
          tagged_resources (resource_id, resources (resource_name)),
          profiles (role)
        `)
        .lt("created_at", lastDate) // Fetch posts older than the last loaded date
        .order("created_at", { descending: true })
        .limit(10); // Load in chunks (adjust as needed)

      if (error) throw error;

      if (data.length === 0) {
        setHasMore(false); // No more posts to load
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching older posts:", error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle real-time updates
  useEffect(() => {
    const initializePosts = async () => {
      await fetchInitialPosts();
    };

    initializePosts();

    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            setPosts((prevPosts) => {
              const exists = prevPosts.some((post) => post.id === payload.new.id);
              return exists ? prevPosts : [payload.new, ...prevPosts];
            });
          
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
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMoreRef, hasMore, loadingMore]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) {
      // Stop if all posts are loaded or a fetch is in progress
      return;
    }
  
    if (posts.length) {
      const lastPostDate = posts[posts.length - 1].created_at;
      fetchOlderPosts(lastPostDate);
    }
  };
  

  const groupPostsByDate = (posts) => {
    const grouped = posts.reduce((acc, post) => {
      const date = new Date(post.created_at).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(post);
      return acc;
    }, {});
  
    // Sort each date group by `created_at` descending
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
  
    // Convert to array and sort dates descending
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };
  

  const groupedPosts = groupPostsByDate(posts);

  return (
    <Box maxHeight="1000px" overflow="auto" mt="23px" width="100%">
      {/* <AddPostInput/> */}
      {/* <Circle>
        <PostsAddDrawer />
      </Circle> */}
      <VStack spacing={4} align="stretch" maxHeight="75.9vh" mx="20px">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {groupedPosts.map(([date, posts]) => (
              <Box key={date}>
                <HStack>
                <Separator my={4} borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
                <Text fontWeight="bold" fontSize="xs" w="100%" color="pink.500" textAlign="center">
                  {date.slice(0, 10) + ", " + date.slice(11)}
                </Text>
                <Separator my={4} borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
                </HStack>

                {posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </Box>
            ))}

            {hasMore && (
              <Box ref={loadMoreRef}>
                {loadingMore ? (
                  <Text>Loading more...</Text>
                ) : (
                  <Center>
                  <Button 
                    firstFlow 
                    onClick={handleLoadMore} 
                    my={4} 
                    size="xs"
                    >
                    Load More
                  </Button>
                  </Center>
                )}
              </Box>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default CommunityFeed;
