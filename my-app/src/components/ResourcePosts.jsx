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

} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { useSelector } from "react-redux";
import { supabase } from "../App";
import ResourcePostReplyDrawer from "./ResourcePostReplyDrawer";
import PostDate from "./Posts/PostDate";
import { StatLabel, StatRoot, StatValueText } from "./ui/stat";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { addLikeToResourceFeed } from "../supabaseRoutes";

const ResourcePost = ({ post }) => {
  const { user } = useSelector((state) => state.user);
  const [parentPost, setParentPost] = useState(null); // State to store parent post content
  console.log("Parent Post:", parentPost); // Debugging: Log the parent post content
 const [likes, setLikes] = useState(post.likes_count || 0); // Initialize with current likes
  const [likesCount, setLikesCount] = useState(post.likes_count || 0); // Track likes locally

  

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

  // Handle the like action
  const handleLike = async () => {
    try {
      const response = await addLikeToResourceFeed(post.id, user.id); // Call the Supabase function
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
    <ResourcePostReplyDrawer
      parentPostId={post.id}
      trigger={
        <Box
          maxWidth="100%"
          p={4}
          
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
              maxHeight="100%"
              maxWidth="100%"
              color="gray.700"
              _dark={{ color: "pink.200" }}
             
              
            >
              <HStack>
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

          <Button variant="ghost" height="100%" onClick={handleLike} w={0} ml="40px">
                  <StatRoot>
                      <HStack mx="30px" fontSize="12px">
                          {/* <Text >Likes</Text> */}
                          {/* <Icon
                            size="xs"
                          > */}
                                   <Box as={BsHandThumbsUpFill} color="pink.300" height="13px" />

                          {/* </Icon> */}
                          <Text >{likesCount}</Text>
                      </HStack>
                  </StatRoot>
          </Button>


                
              

           
            </Box>
         
            {post.image_url && (
              <Box  borderRadius="8px" shadow="md" maxWidth= "150px" ml="47px" mt={2} mb={4}>
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  style={{ borderRadius: "8px",  }}
                />
              </Box>
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
        </Box>
      }
    />
  );
};

export default ResourcePost;
