"use client";

import { Button } from "@/components/ui/button";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import EditPostForm from "./EditPostForm";
import { FaRegEdit } from "react-icons/fa";

const EditPostDrawer = ({ postId, currentContent, currentImageUrl }) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerRoot 
      open={open} 
      onOpenChange={(e) => setOpen(e.open)} 
     
      placement="bottom"
      
      
      >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="ghost" size="xs" position="relative" left="35px" bottom="30.5px" borderRadius="4xl" _hover={{bg:"pink.300"}}>
        <FaRegEdit />
        </Button>
      </DrawerTrigger>
      <DrawerContent  
        position="absolute"
        roundedTop="md"
        width="47%"
        ml="6%"
        border="2px solid"
        borderColor="pink.300"
        borderBottom="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle,rgb(87, 36, 54),rgb(24, 23, 29))",
        }}
        >
        <DrawerHeader>
          <DrawerTitle>Edit Post</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <EditPostForm postId={postId} currentContent={currentContent} currentImageUrl={currentImageUrl} />
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button logout size="xs" variant="outline">Cancel</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default EditPostDrawer;
