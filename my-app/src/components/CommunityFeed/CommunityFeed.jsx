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
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

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
  
  // Fetch initial posts
  const fetchInitialPosts = async () => {
    try {
      setLoading(true);

      // Use denormalized author_avatar from posts table
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          user_id,
          author_username,
          author_avatar,
          parent_post_id,
          posts_reactions (reactions, user_id)
        `)
        .order("created_at", { descending: true })
        .limit(100);

      if (error) throw error;
      setPosts(data || []);

      // Fetch all related data in parallel
      if (data?.length) {
        const userIds = [...new Set(data.map(post => post.user_id))];
        const postIds = data.map(post => post.id);

        const [profilesRes, reactionsRes, taggedUsersRes, taggedResourcesRes] = await Promise.all([
          supabase.from('profiles').select('id, role').in('id', userIds),
          supabase.from('posts_reactions').select('*').in('post_id', postIds),
          supabase.from('tagged_users').select('*').in('post_id', postIds),
          supabase.from('tagged_resources').select('*, resources(resource_name)').in('post_id', postIds)
        ]);

        // Update posts with all related data
        setPosts(prevPosts => 
          prevPosts.map(post => ({
            ...post,
            profile: profilesRes.data?.find(p => p.id === post.user_id),
            posts_reactions: reactionsRes.data?.filter(r => r.post_id === post.id) || [],
            tagged_users: taggedUsersRes.data?.filter(t => t.post_id === post.id) || [],
            tagged_resources: taggedResourcesRes.data?.filter(t => t.post_id === post.id) || []
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
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
          user_id,
          author_username,
          author_avatar,
          parent_post_id,
          posts_reactions (reactions, user_id)
        `)
        .lt("created_at", lastDate)
        .order("created_at", { descending: true })
        .limit(10);

      if (error) throw error;

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...data]);
        
        const userIds = [...new Set(data.map(post => post.user_id))];
        const postIds = data.map(post => post.id);

        const [profilesRes, reactionsRes, taggedUsersRes, taggedResourcesRes] = await Promise.all([
          supabase.from('profiles').select('id, role').in('id', userIds),
          supabase.from('posts_reactions').select('*').in('post_id', postIds),
          supabase.from('tagged_users').select('*').in('post_id', postIds),
          supabase.from('tagged_resources').select('*, resources(resource_name)').in('post_id', postIds)
        ]);

        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (!postIds.includes(post.id)) return post; // Keep existing post data if not in new batch
            return {
              ...post,
              profile: profilesRes.data?.find(p => p.id === post.user_id),
              posts_reactions: reactionsRes.data?.filter(r => r.post_id === post.id) || [],
              tagged_users: taggedUsersRes.data?.filter(t => t.post_id === post.id) || [],
              tagged_resources: taggedResourcesRes.data?.filter(t => t.post_id === post.id) || []
            };
          })
        );
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

  // Add row renderer for virtualized list
  const rowRenderer = ({ index, key, style }) => {
    const [date, datePosts] = groupedPosts[index];
    
    return (
      <div key={key} style={{ ...style, padding: '8px 20px' }}>
        <Box>
          <HStack mb={4}>
            <Separator borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
            <Text fontWeight="bold" fontSize="xs" color="pink.500" textAlign="center">
              {date}
            </Text>
            <Separator borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
          </HStack>
          <VStack spacing={4} align="stretch">
            {datePosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </VStack>
        </Box>
      </div>
    );
  };

  // Add height calculation for rows
  const getRowHeight = ({ index }) => {
    const [_, datePosts] = groupedPosts[index];
    let height = 50; // Header height
    
    // Calculate height for all posts in this date group
    datePosts.forEach(post => {
      height += 150; // Base post height
      if (post.image_url) height += 200;
      if (post.parent_post_id) height += 100;
    });
    
    return height;
  };

  return (
    <Box 
      height="75vh" // Set a fixed height
      width="100%"
      mt="23px"
      position="relative" // Add position relative
    >
      {loading || !user ? (
        renderSkeleton()
      ) : (
        <Box height="100%" width="100%"> {/* Add wrapper with full dimensions */}
          <AutoSizer>
            {({ width, height }) => {
              console.log('AutoSizer dimensions:', { width, height }); // Debug dimensions
              return (
                <List
                  width={width}
                  height={height}
                  rowCount={groupedPosts.length}
                  rowHeight={getRowHeight}
                  rowRenderer={rowRenderer}
                  overscanRowCount={3}
                  style={{
                    background: 'transparent',
                    outline: 'none'
                  }}
                />
              );
            }}
          </AutoSizer>
        </Box>
      )}
    </Box>
  );
};

export default CommunityFeed;
