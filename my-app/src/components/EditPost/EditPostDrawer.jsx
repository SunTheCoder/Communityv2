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
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="ghost" size="xs" position="relative" left="35px" bottom="30.5px" borderRadius="4xl" _hover={{bg:"pink.300"}}>
        <FaRegEdit />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Post</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <EditPostForm postId={postId} currentContent={currentContent} currentImageUrl={currentImageUrl} />
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default EditPostDrawer;
