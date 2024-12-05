import {
  Box,
  Text,
  Card,
  Button,
  Image
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
import { DataListItem, DataListRoot } from "./ui/data-list";
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
    <DrawerRoot placement="bottom" roundedTop size="full">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerBackdrop closeOnOverlayClick={false} />
      <DrawerContent roundedTop="md" width="47.6%" ml="6%" >
        <Box>
          <Text>
            {/* Resource Details: {resource?.resource_name || "Loading..."} */}
          </Text>
        </Box>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle textAlign="center">Resource Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {resource ? (
            <Card.Root maxW="xl" overflow="hidden" boxShadow="lg" borderRadius="lg">
              {/* Resource Image */}
              <Image
                src={resource.image_url || "/no-image.png"}
                alt={resource.resource_name || "Unnamed Resource"}
                maxHeight="300px"
                objectFit="cover"
                width="100%"
              />
              {/* Card Body */}
              <Card.Body p={6}>
                <Card.Title fontSize="2xl" fontWeight="bold">
                  {resource.resource_name || "Unnamed Resource"}
                </Card.Title>
                <Card.Description fontSize="lg" mt={2} color="gray.600">
                  {resource.description || "No description available."}
                </Card.Description>
                <Box mt={4}>
                  <Text fontSize="md" fontWeight="medium">
                    <strong>City:</strong> {resource.city || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Type:</strong> {resource.resource_type || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Created:</strong> {(resource.created_at) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Type:</strong> {(resource.resource_type) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Address:</strong> {(resource.street_address) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>City:</strong> {(resource.city) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>State:</strong> {(resource.state) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Zip Code:</strong> {(resource.zip_code) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Longitude</strong> {(resource.longitude) || "Unknown"}
                  </Text> 
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Latitude:</strong> {(resource.latitude) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Community Verified:</strong> {(resource.community_verified) || "Unknown"}
                  </Text>
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Last Cleaned:</strong> {(resource.last_cleaned) || "Unknown"}
                  </Text>


                  

                  


                </Box>
              </Card.Body>
              {/* Card Footer */}
              <Card.Footer p={4} borderTop="1px solid" borderColor="gray.200">
               




              </Card.Footer>
            </Card.Root>
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
