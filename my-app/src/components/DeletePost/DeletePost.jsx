import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { supabase } from "@/App";
import { RiDeleteBin2Fill } from "react-icons/ri";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip } from "../ui/tooltip";

const deletePost = async (postId) => {
  try {
    if (!postId) {
      console.error("Post ID is required to delete a post.");
      toaster.create({
        title: "Post ID is required",
        description: "Failed to delete post. Please provide a valid post ID.",
        type: "error",
        duration: 5000,
      });
      return false;
    }

    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error.message);
      toaster.create({
        title: "Error Deleting Post",
        description: "Failed to delete post. Please try again later.",
        type: "error",
        duration: 5000,
      });
      return false;
    }

    toaster.create({
      description: "Post deleted successfully!",
      type: "success",
      duration: 5000,
    });
    return true;
  } catch (err) {
    console.error("Unexpected error during post deletion:", err.message);
    toaster.create({
      title: "Error Deleting Post",
      description: "An unexpected error occurred while deleting the post.",
      type: "error",
      duration: 5000,
    });
    return false;
  }
};

const DeletePostButton = ({ postId }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deletePost(postId);
    if (result) {
      console.log(`Post with ID ${postId} was deleted.`);
      setOpen(false); // Close the dialog after successful deletion
    }
  };

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      {/* Trigger to open the dialog */}
          <Tooltip
                content="Delete Post"
               
              >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          position="relative"
          bottom="63px"
          left="216px"
          borderRadius="4xl"
          px="0"
          _hover={{ bg: "pink.300" }}
        >
          <RiDeleteBin2Fill />
        </Button>
      </DialogTrigger>
</Tooltip>
      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger asChild
            bg= "radial-gradient(circle, #FFF6F5, #D0F5D6)" // Light pink to light green
            color= "pink.800" // Default text color
            _dark={{
              bg: "radial-gradient(circle, #8B4A62, #1E392A)", // Dark pink to dark green
              color: "pink.200", // Dark mode text color
            }}
            _hover= {{
              bg: "radial-gradient(circle, #FCECEC, #B8E6BE)", // Hover: light pink to soft green
              _dark: {
                bg: "radial-gradient(circle, #732f4f, #183E28)", // Hover: Dark pink to darker green
              },
            }}
          >
            <Button >
              Cancel
            </Button>
          </DialogTrigger>
          <Button login onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeletePostButton;
