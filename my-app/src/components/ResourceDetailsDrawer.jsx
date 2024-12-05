import {
  Box,
  Text,
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
} from "./ui/drawer";
import React, { useState, useEffect } from "react";
import { fetchResourceById } from "../supabaseRoutes";

const ResourceDetailsDrawer = ({ resourceId, trigger }) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    console.log("Resource ID:", resourceId); // Debugging: Check if resourceId is passed

    const fetchResource = async () => {
      if (!resourceId) return;

      try {
        const fetchedResource = await fetchResourceById(resourceId);
        console.log("Fetched Resource:", fetchedResource); // Debugging: Log the fetched resource
        setResource(fetchedResource);
      } catch (error) {
        console.error("Error fetching resource details:", error.message);
      }
    };

    fetchResource();
  }, [resourceId]);

  return (
    <DrawerRoot placement="bottom" roundedTop>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent roundedTop="md" width="47.6%" ml="6%">
        <Box>
          <Text>
            Resource Details: {resource?.resource_name || "Loading..."}
          </Text>
        </Box>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>Resource Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {resource ? (
            <Box>
              <Text fontWeight="bold">{resource.resource_name || "Unnamed Resource"}</Text>
              <Text>
                <strong>City:</strong> {resource.city || "Unknown"}
              </Text>
              <Text>
                <strong>Type:</strong> {resource.resource_type || "Unknown"}
              </Text>
              <Text>
                <strong>Description:</strong> {resource.description || "No description available."}
              </Text>
            </Box>
          ) : (
            <Text>Loading resource details...</Text>
          )}
        </DrawerBody>
        <DrawerFooter>
          <Text color="gray.500" fontSize="sm">
            Close the drawer to return to the list.
          </Text>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ResourceDetailsDrawer;
