import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../App";
import { Box, Text, VStack, Separator, Button, HStack, Circle, Center } from "@chakra-ui/react";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "../ui/skeleton"
import Post from "../Posts/Posts"; // Import the Post component
import PostsAddDrawer from "../Posts/PostsAddDrawer";
import AddPostInput from "./AddPostInput";

const CommunityFeed = () => {
  const user  = useSelector((state) => state.user?.user);
  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // For initial fetch
  const [loadingMore, setLoadingMore] = useState(false); // For lazy loading
  const [hasMore, setHasMore] = useState(true); // Track if more posts are available

  const loadMoreRef = useRef(); // Ref for the scroll trigger

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const shouldShowImage = () => Math.random() > 0.5; // 50% chance to show an image


  const renderSkeleton = () => (
    <VStack gap="6" w="full">
      <Separator my={4} w="100%" borderColor="pink.300" _dark={{ borderColor: "pink.600" }} />
      {[...Array(25)].map((_, index) => {
        const hasImage = shouldShowImage();
        const textLines = getRandomInt(1, 5); // Randomize number of text lines (1 to 5)
        const textWidth = `${getRandomInt(60, 90)}%`; // Randomize text width (60% to 90%)
  
        return (
          <Box key={index} w="full">
            <HStack width="75%" mb={4}>
              <SkeletonCircle size="10" />
              <SkeletonText
                noOfLines={textLines}
                spacing="4"
                skeletonHeight="2"
                width={textWidth} // Randomized text width
              />
            </HStack>
            {hasImage && (
              <Skeleton ml="48px" height="200px" mt="4" w={`${getRandomInt(30, 50)}%`} /> // Randomize image width (30% to 50%)
            )}
          </Box>
        );
      })}
    </VStack>
  );
  
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
        async (payload) => {
          console.log("Change received:", payload);
  
          if (payload.eventType === "INSERT") {
            const { data: newPost, error } = await supabase
              .from("posts")
              .select(`
                *,
                profiles(role) -- Include the related profile data
              `)
              .eq("id", payload.new.id)
              .single();
      
            if (error) {
              console.error("Error fetching new post with profile data:", error);
            } else {
              setPosts((prevPosts) => [newPost, ...prevPosts]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Refetch the updated post to include related data (e.g., profiles.role)
            const { data: updatedPost, error } = await supabase
              .from("posts")
              .select("*, profiles(role)") // Include related profile data
              .eq("id", payload.new.id)
              .single();
  
            if (error) {
              console.error("Error refetching updated post:", error);
            } else {
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === updatedPost.id ? updatedPost : post
                )
              );
            }
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
      <VStack spacing={4} align="stretch" maxHeight="75.9vh" mx="20px">
        {loading || !user ? (
          renderSkeleton()
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
                  renderSkeleton()
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
