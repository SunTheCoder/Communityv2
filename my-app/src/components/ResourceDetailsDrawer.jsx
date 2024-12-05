import {
    Box,
    Text
 
  } from '@chakra-ui/react'
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
  } from "./ui/drawer"
import React, { useState, useEffect } from 'react';
import { supabase } from "../App";
import { fetchResourceById } from '../supabaseRoutes';



  function ResourceDetailsDrawer({ resourceId, trigger }) {
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const [resource, setResource] = useState(null);

    
    
    
    
      useEffect(() => {
        const getResource = async () => {
          const fetchedResource = await fetchResourceById(resourceId);
          setResource(fetchedResource);
        };
    
        if (resourceId) {
          getResource();
        }
      }, [resourceId]);




        
    
    return (
      
       <DrawerRoot placement="bottom" roundedTop>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent roundedTop="md" width="47.6%" ml="6%">
          <Box>
            <Text>
              Resource Details: {resource?.resource_name}
            </Text>
          </Box>
          <DrawerCloseTrigger />
          <DrawerHeader>
            <DrawerTitle />
          </DrawerHeader>
          <DrawerBody />
          <DrawerFooter />
        </DrawerContent>
      </DrawerRoot>
      
    )
  }
  export default ResourceDetailsDrawer;