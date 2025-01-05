import React, { forwardRef } from "react";
import {

  Textarea,
  Button,
} from "@chakra-ui/react";
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

const PostDrawer = forwardRef(({ isOpen, onClose, content, setContent, onSubmit }, ref) => {
  return (
    <DrawerRoot isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerBackdrop />
      <DrawerContent
        
      
      >
        <DrawerCloseTrigger/>
        <DrawerHeader>Edit Your Post</DrawerHeader>
        <DrawerBody>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            ref={ref}
            placeholder="Continue writing your post here..."
            size="lg"
            minH="200px"
          />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="pink" onClick={onSubmit}>
            Submit Post
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
});

export default PostDrawer;
