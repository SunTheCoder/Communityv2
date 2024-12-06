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
  Stack
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { useSelector } from "react-redux";
import { supabase } from "../App";
import ResourcePostReplyDrawer from "./ResourcePostReplyDrawer";
import PostDate from "./PostDate";

const ResourcePost = ({ post }) => {
  const { user } = useSelector((state) => state.user);
  const [parentPost, setParentPost] = useState(null); // State to store parent post content
  console.log("Parent Post:", parentPost); // Debugging: Log the parent post content
 const [likes, setLikes] = useState(post.likes_count || 0); // Initialize with current likes

  const handleLike = async () => {
    try {
      const response = await addLikeToCommFeed(post.id);
      if (response.success) {
        setLikes((prev) => prev + 1); // Optimistically update UI
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  // Fetch the parent post content if parent_post_id is not null
  useEffect(() => {
    const fetchParentPost = async () => {
      if (post.parent_post_id) {
        try {
          const { data, error } = await supabase
            .from("resource_posts")
            .select("content, author_username")
            .eq("id", post.parent_post_id)
            .single();
          if (error) throw error;

          setParentPost(data);
        } catch (error) {
          console.error("Error fetching parent post:", error.message);
        }
      }
    };

    fetchParentPost();
  }, [post.parent_post_id]);

  return (
    <ResourcePostReplyDrawer
      parentPostId={post.id}
      trigger={
        <Box
        //   maxWidth="1200px"
          px={0}
        //   bg="white"
          borderRadius="md"
        //   boxShadow="sm"
          ml={2.5}
        //   mb={4}
        //   _dark={{ bg: "gray.800" }}
        //   _hover={{ border: "1px solid", borderColor: "gray.700" }}
          cursor="pointer"
          
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
                            height="30px"
                            width="50px"
                            borderColor="pink.600"
                            mb={-7}
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
                        
                        _dark={{ bg: "gray.700"  }}
                        p={2}
                        borderRadius="md"
                        my={2}
                        fontSize="xs"
                        minWidth="0px"
                        maxWidth="215px"
                        bg="purple.100"

                        mx={1}
                        width="100%"
                        shadow="sm"
                      >
                        <Stack fontWeight="" gap={0}>
                          <Box color="pink.600" fontWeight="semibold">
                            @{parentPost.author_username}:
                          </Box>
                          <Box truncate color="gray.700" _dark={{color: "pink.200"}}>{parentPost.content}</Box>
                        </Stack>
                      </Box>
                  
                  </HStack>
                )}

               <HStack>
                {post.user_id === user?.id ? (
                  <Avatar
                    size="xs"
                    src={user?.avatarUrl || "User avatar"}
                    alt={user?.username || "User username"}
                    colorPalette="pink"
                    css={ringCss}
                    my={2}
                  />
                ) : (
                  <Avatar size="xs" />
                )}
               
            <Box
              maxHeight="150px"
              maxWidth="425px"
              color="gray.700"
              _dark={{ color: "pink.200" }}
             
              
            >
                <Text
                  size="xs"
                  color="gray.700"
                  _dark={{ color: "pink.200" }}
                  fontWeight="semibold"
                  mx={2}
                >
                  {post.author_username}<PostDate createdAt={post.created_at} />
                </Text>
                {parentPost ? (
              <Text bg="pink.100"
                        _dark={{ bg: "gray.700" }}
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
                bg="purple.100"
                _dark={{ bg: "gray.700" }}
                p={2}
                borderRadius="md"
                my={2}
                fontSize="xs"
               
                shadow="sm"
                mx={2}
                mt={2}
              >{post.content}</Text>)}
            </Box>

            
            {post.image_url && (
              <Box  borderRadius="8px" shadow="md">
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  style={{ borderRadius: "8px", maxWidth: "100%" }}
                />
              </Box>
            )}
          </HStack>

                

                
              

              {post.profiles?.role === "admin" && (
                <Text fontSize="xs" color="red.500" fontWeight="bold">
                  Admin
                </Text>
              )}
            </Box>
         

          

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
        </Box>
      }
    />
  );
};

export default ResourcePost;
