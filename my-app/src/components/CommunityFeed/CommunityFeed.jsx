import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../App";
import { Box, Text, VStack, Separator, Button, HStack, Center } from "@chakra-ui/react";
import Post from "../Posts/Posts";

const CommunityFeed = () => {
  const user = useSelector((state) => state.user?.user);
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showingAll, setShowingAll] = useState(false);

  // Fetch all posts but only show latest 10
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select('*')
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const sortedData = data?.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ) || [];

      setAllPosts(sortedData);
      // Only show latest 10 posts
      setVisiblePosts(sortedData.slice(0, 10));
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, 
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newPost = payload.new;
            // Add new post to all posts
            setAllPosts(prev => [newPost, ...prev]);
            // Update visible posts if showing latest 10
            if (!showingAll) {
              setVisiblePosts(prev => [newPost, ...prev.slice(0, 9)]);
            } else {
              setVisiblePosts(prev => [newPost, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedPost = payload.new;
            setAllPosts(prev => prev.map(post => 
              post.id === updatedPost.id ? updatedPost : post
            ));
            setVisiblePosts(prev => prev.map(post => 
              post.id === updatedPost.id ? updatedPost : post
            ));
          } else if (payload.eventType === "DELETE") {
            setAllPosts(prev => prev.filter(post => post.id !== payload.old.id));
            setVisiblePosts(prev => prev.filter(post => post.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showingAll]);

  // Load all posts when button clicked
  const handleShowAll = () => {
    setVisiblePosts(allPosts);
    setShowingAll(true);
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const groupPostsByDate = (posts) => {
    const grouped = posts.reduce((acc, post) => {
      const date = new Date(post.created_at).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(post);
      return acc;
    }, {});

    return Object.entries(grouped).sort((a, b) => 
      new Date(b[0]) - new Date(a[0])
    );
  };

  const groupedPosts = groupPostsByDate(visiblePosts);

  if (loading || !user) {
    return <Box mt="23px"><renderSkeleton /></Box>;
  }

  return (
    <Box maxHeight="75vh" overflow="auto" mt="23px" width="100%">
      <VStack spacing={4} align="stretch" mx="20px">
        {groupedPosts.map(([date, posts]) => (
          <Box key={date}>
            <HStack mb={4}>
              <Separator borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
              <Text fontWeight="bold" fontSize="xs" color="pink.500" textAlign="center">
                {date}
              </Text>
              <Separator borderColor="pink.300" _dark={{borderColor: "pink.600"}}/>
            </HStack>
            <VStack spacing={4} align="stretch">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </VStack>
          </Box>
        ))}
        {!showingAll && allPosts.length > 10 && (
          <Center mt={4}>
            <Button 
              login
              onClick={handleShowAll}
              size="sm"
              mb={4}
            >
              Show All Posts
            </Button>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default CommunityFeed;
