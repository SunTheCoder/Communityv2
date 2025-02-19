import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  defineStyle,
  Separator,
  Image,
  Stack,
  Button,
  Icon
} from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { StatLabel, StatRoot, StatValueText } from "../ui/stat";
import { ProgressBar, ProgressRoot } from "../ui/progress"
import { BsHandThumbsUpFill } from "react-icons/bs";
import LikeButton from "../CommunityFeed/LikeButton";

import { useSelector } from "react-redux";
import { supabase } from "../../App";
import PostReplyDrawer from "./PostsReplyDrawer";
import PostDate from "./PostDate";
import { addLikeToCommFeed } from "../../supabaseRoutes";
import EditPostDrawer from "../EditPost/EditPostDrawer";
import DeletePostButton from "../DeletePost/DeletePost";
import { Tooltip } from "../ui/tooltip";
import PostDetailsDrawer from "./PostDetailsDrawer";
import AddReaction from "../CommunityFeed/AddReactionComponent";
import PostReactions from "../CommunityFeed/PostReactions";
import HoverLikeButton from "../CommunityFeed/HoverLikeButton";
import { addReactionToCommFeed } from "@/supabaseRoutes/supabaseRoutes";
import ReactionSummary from "../CommunityFeed/ReactionSummary";

const Post = ({ post }) => {
  const { user } = useSelector((state) => state.user || {});
  const userId = user?.id; // Safely access userId

  const [parentPost, setParentPost] = useState(null); // State to store parent post content
  const [likesCount, setLikesCount] = useState(post.likes_count || 0); // Track likes locally
  const [userAvatar, setUserAvatar] = useState(null); // Store user avatar URL
  
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  // Fetch the parent post content if parent_post_id is not null
  useEffect(() => {
    const fetchPostData = async () => {
      if (post.parent_post_id || post?.user_id) {
        try {
          const [parentPostResult, avatarResult] = await Promise.all([
            post.parent_post_id ? 
              supabase
                .from("posts")
                .select("content, author_username")
                .eq("id", post.parent_post_id)
                .single() : 
              Promise.resolve(null),
            post?.user_id ?
              supabase
                .from("profiles")
                .select("avatar_url")
                .eq("id", post.user_id)
                .single() :
              Promise.resolve(null)
          ]);

          if (parentPostResult?.data) {
            setParentPost(parentPostResult.data);
          }
          if (avatarResult?.data) {
            setUserAvatar(avatarResult.data.avatar_url);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      }
    };

    fetchPostData();
  }, [post.parent_post_id, post?.user_id]);

   // Handle the like action
   const handleLike = async () => {
    try {
      const response = await addLikeToCommFeed(post.id, user.id); // Call the Supabase function
      if (response.success) {
        setLikesCount((prev) => prev + 1); // Optimistically update the like count
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  return (
    <Box position="relative">
    <PostReplyDrawer
      parentPostId={post.id}
      trigger={
        <Box
          maxWidth="100%"
          p={4}
          pb={7}
          
        //   bg="white"
          borderRadius="md"
        //   boxShadow="sm"
          ml={2.5}
          // mb={4}
          _dark={{ _active: { bg:"gray.600", shadow: "md" }} }
        //   _hover={{ border: "1px solid", borderColor: "gray.700" }}
          cursor="pointer"
          _active={{ bg: "gray.100", shadow: "md" }}
          
        >
         
            <Box>
              {/* <PostDate createdAt={post.created_at} /> */}

              {parentPost && (
                  <HStack >
                        <Box
                            roundedTopLeft="lg"
                            border="2px solid"
                            borderBottom="none"
                            borderRight="none"
                            height="40px"
                            width="50px"
                            borderColor="pink.600"
                            mb={-10}
                            ml={3.5}
                            >
                        </Box>
                      {/* <Separator
                        orientation="horizontal"
                        size="sm"
                        borderColor="pink.600"
                        width="40px"
                      /> */}
                      <Box direction="column" align="flex-start" spacing={2}
                       
                       _dark={{bg:"radial-gradient(circle, #4A708B, #2C2A35)"}}
                        p={2}
                        borderRadius="md"
                        my={2}
                        fontSize="xs"
                        minWidth="0px"
                        maxWidth="215px"
                        mx={1}
                        // bg="purple.100"
                        bg="radial-gradient(circle, #E0FFFF, #E6E6FA)" // Cool gradient for replies
            

                        width="100%"
                        shadow="sm"
                      >
                        <Stack fontWeight="" gap={0} 
>
                          <Box 
                              color="pink.600" 
                              fontWeight="semibold"
                              >
                            @{parentPost.author_username}
                          </Box>
                          <Box truncate 
                            color="gray.700" 
                            _dark={{color: "pink.200"}} 
                            mx={3}>{parentPost.content}
                            </Box>
                        </Stack>
                      </Box>
                  
                  </HStack>
                )}

               <HStack>
                {post.user_id === user?.id ? (            
                  <Avatar
                    size="lg"
                    src={user?.avatarUrl || "User avatar"}
                    alt={user?.username || "User username"}
                    colorPalette="pink"
                    css={ringCss}
                    my={2}
                  />                
                ) : (
                  <Avatar 
                    size="lg" 
                    src={userAvatar || "User avatar"} 
                    alt={user?.username || "User username"}
                    colorPalette="blue"
                    css={ringCss}
                    my={2}
                    
                    />
                )}
               
            <Box
              maxHeight="100%"
              maxWidth="90%"
              color="gray.700"
              _dark={{ color: "pink.200" }}
             
              
            >
              <HStack   
              >
                <Text
                  size="xs"
                  color="gray.700"
                  _dark={{ color: "pink.200" }}
                  fontWeight="semibold"
                  mx="7px"
                >
                  {post.author_username}
                  
                </Text>
                <Box mx={2}>
                  <PostDate createdAt={post.created_at} />
                  </Box></HStack>
                {post.profiles?.role === "admin" && (
                <Text fontSize="xs" color="red.500" fontWeight="bold" m="7px">
                  Admin
                </Text>
              )}
                {parentPost ? (
              <Text bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" 
                    
                        _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}

                        p={2}
                        borderRadius="md"
                        my={2}
                        fontSize="xs"
                       
                        shadow="sm"
                        mx={2}
                        mt={2}>
                {post.content}
              </Text>) :
              (<Text
                // bg="purple.100"
                bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" 
                _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)"}}

                          
                // _dark={{ bg: "gray.700" }}
                p={2}
                borderRadius="md"
                my={2}
                fontSize="xs"
               
                shadow="sm"
                mx={2}
                mt={2}
              >{post.content}</Text>)}

</Box>
            
        
            

            
          </HStack>

         


                
              

           
            </Box>
           
            {post.image_url && (
              <Flex  borderRadius="8px" shadow="md" maxWidth= "150px" ml="59px" mt={2} mb={4}>
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  style={{ borderRadius: "8px",  }}
                />
                
              </Flex>
            )}
                

          

          {post.tagged_resources?.length > 0 && (
            <VStack align="flex-start" mt={4}>
              <Text fontWeight="bold">Tagged Resources:</Text>
              {post.tagged_resources.map((tagged) => (
                <Text key={tagged.resource_id} fontSize="sm">
                  {tagged.resources.resource_name || "Unknown Resource"}
                </Text>
              ))}
            </VStack>
          )}
      <PostReactions postId={post.id} reactions={post.reactions}/>
        </Box>
      }
      
    />
    <HStack pos="absolute" bottom="8px">
    <Box pos="relative" left="205px" >
      <HoverLikeButton postId={post.id} reactorId={userId} addReaction={addReactionToCommFeed} /></Box>
      {/* <AddReaction postId={post.id} /> */}
      {/* <ReactionSummary postId={post.id} reactions={post.reactions} /> */}
    {/* <LikeButton
    
    postId={post.id}
    likesCount={post.likes_count} // Pass real-time likes_count
    userId={userId} // Pass the current user's ID
  /> */}
    {user.id === post.user_id && (
      <EditPostDrawer 
      postId={post.id} 
      currentContent={post.content} 
      currentImageUrl={post.image_url} 
      />

      
    )}
    {user.id === post.user_id && (
    
        <DeletePostButton postId={post.id}/>

    )}
    
    
<PostDetailsDrawer user={user} post={post} parentPost={parentPost} />


  </HStack>
  </Box>
  );
};

export default Post;
