import {
  Box,
  Text,
  Card,
  Button,
  Image,
  Heading,
  Collapsible
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
      <DrawerBackdrop/>
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
                <Card.Title fontSize="2xl" fontWeight="bold" textAlign="center">
                  {resource.resource_name || "Unnamed Resource"}
                </Card.Title>
                <Card.Description fontSize="lg" mt={2} color="gray.600">
                  {resource.description || "No description available."}
                </Card.Description>
                <Box mt={4} >
                  
                  <Collapsible.Root unmountOnExit>
                  <Collapsible.Trigger >
                   <Heading size="lg" fontWeight="bold" color="gray.700" _hover={{ color: "gray.400", cursor:"pointer"}}>
                     Address
                   </Heading>
            
                    </Collapsible.Trigger>
  <Collapsible.Content >
                  <Text fontSize="md" fontWeight="medium">
                    {resource.street_address || "Unknown"} <br></br>
                    {resource.city || "Unknown"} <br></br>
                    {resource.state || "Unknown"} <br></br>
                    {resource.zip_code || "Unknown"}
                  </Text>
                  </Collapsible.Content>
                  </Collapsible.Root >
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

                  {/* New Accessibility Section */}
        <Box mt={6} >
          <Heading size="lg" fontWeight="bold" >
            Accessibility
          </Heading>
          <Text fontSize="md" mt={2}>
            <strong>Wheelchair Access:</strong>{" "}
            {resource.wheelchair_access ? "Yes" : "No"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Car Access:</strong> {resource.car_access ? "Yes" : "No"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Pickup Truck Access:</strong>{" "}
            {resource.pickup_truck_access ? "Yes" : "No"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Commercial Truck Access:</strong>{" "}
            {resource.commercial_truck_access ? "Yes" : "No"}
          </Text>
        </Box>
        {/* New Maintenance Section */}
        <Box mt={6}>
          <Heading size="lg" fontWeight="bold">
            Maintenance
          </Heading>
          <Text fontSize="md" mt={2}>
            <strong>Street Lights:</strong>{" "}
            {resource.has_street_lights ? "Yes" : "No"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Last Cleaned:</strong>{" "}
            {resource.last_cleaned
              ? new Date(resource.last_cleaned).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Needs Maintenance:</strong>{" "}
            {resource.needs_maintenance ? "Yes" : "No"}
          </Text>
          <Text fontSize="md" mt={2}>
            <strong>Last Maintenance:</strong>{" "}
            {resource.last_maintenance
              ? new Date(resource.last_maintenance).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </Text>
        </Box>

                  

                  


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
