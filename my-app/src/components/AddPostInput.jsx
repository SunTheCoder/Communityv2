import React from "react";
import { useForm } from "react-hook-form";
import { Box, Input, Button, VStack, Text, Circle, Group } from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import { supabase } from "../App";
import { useSelector } from "react-redux";
import { InputGroup } from "./ui/input-group";
import { CiCirclePlus } from "react-icons/ci";

const AddPostInput = () => {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!user) {
        throw new Error("User not logged in. Please log in to create a post.");
      }

      const { content, imageUrl } = data;

      const { error } = await supabase.from("posts").insert([
        {
          content: content.trim(),
          image_url: imageUrl || null,
          author_username: user.username,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toaster.create({
        description: "Post created successfully!",
        type: "success",
      });

      reset(); // Clear the form after successful submission
    } catch (error) {
      console.error("Error creating post:", error.message);
      toaster.create({
        title: "Error Creating Post",
        description: error.message,
        type: "error",
      });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)} // Use form's onSubmit handler
      // pt={1}
      mx={8}
      mt="48px"
      
    //   border="1px solid"
    //   borderColor="gray.200"
      borderRadius="md"
    //   bg="gray.50"
      _dark={{ bg: "gray.800", borderColor: "gray.600" }}
    >
      <Toaster />
      <VStack spacing={4} align="stretch">
       
    <Group attached>
        {/* Post Content Input */}
        <Input
          placeholder="Write your post content..."
          {...register("content", {
            required: "Post content is required",
            minLength: { value: 5, message: "Content must be at least 5 characters" },
          })}
          
          
          borderRightRadius="none"
          shadow="sm"
          _focus={{ borderColor: "pink.500", bg:"pink.50" }}
          _dark={{bg:"gray.200", borderColor: "pink.600", color: "pink.900" }}
          
        //   autoFocus
        />

<Button
  type="submit"
  bg="radial-gradient(circle, #FFE4E1, #E6E6FA)" // Very light pink to lavender
  _dark={{bg:"radial-gradient(circle, #8B4A62, #2C2A35)", color: "pink.200"}}
  
  isLoading={isSubmitting} // Show loading spinner on submit
  borderRadius="md"
  borderLeftRadius="none"
  shadow="sm"
  size="md"
  color="gray.800"
  fontSize="xs"
  variant="plain"
  py="10px"
  position="relative"
  left="1px"
  
>
  Add Post <CiCirclePlus />
</Button>

            </Group>
        {errors.content && (
          <Text fontSize="sm" color="red.500">
            {errors.content.message}
          </Text>
        )}

        {/* Image URL Input */}
        {/* <Input
          placeholder="Optional: Add an image URL"
          {...register("imageUrl", {
            pattern: {
              value: /^https?:\/\/.+$/,
              message: "Enter a valid URL",
            },
          })}
          shadow="sm"
          
          _focus={{ borderColor: "pink.500", shadow: "pink.500", bg:"pink.50"}}
          _dark={{bg:"gray.500"}}
        /> */}
        {errors.imageUrl && (
          <Text fontSize="sm" color="red.500">
            {errors.imageUrl.message}
          </Text>
        )}

        {/* Submit Button */}
       
      </VStack>
    </Box>
  );
};

export default AddPostInput;
