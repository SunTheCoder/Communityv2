import {
  Box,
  Text,
  Card,
  Button,
  Image,
  Heading,
  Collapsible,
  VStack,
  Flex,
  TooltipArrow,
  Grid
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
import { Tooltip } from "./ui/tooltip";
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
      <DrawerContent roundedTop="md" width="47.6%" ml="6%"  border="2px solid" borderColor="gray.200" borderBottom="none" _dark={{borderColor:"pink.600"}}>
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
            <Card.Root maxW="md" overflow="hidden" boxShadow="lg" borderRadius="lg">
              {/* Resource Image */}
              <Image
                src={resource.image_url || "/no-image.png"}
                alt={resource.resource_name || "Unnamed Resource"}
                maxHeight="250px"
                objectFit="cover"
                width="100%"
              />

{resource.resource_images && (
    <Box p={3} >
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)", // 2 columns for small screens
          md: "repeat(3, 1fr)", // 3 columns for medium screens
          lg: "repeat(4, 1fr)", // 4 columns for large screens
        }}
        display="flex"
        gap={4} // Adjust the spacing between images
        justifyContent="center" // Center the images horizontally
      >
        {/* Example Images */}
        {resource.resource_images.map((image, index) => (
          <Box key={index} borderWidth="1px" borderRadius="md" overflow="hidden">
            <Image
              src={image || "/no-image.png"} // Replace `image.url` with your actual image key
              alt={image || "Resource Image"} // Replace `image.alt` with your actual alt text key
              objectFit="cover"
              width="100%"
              maxHeight="200px"
            />
          </Box>
        ))}
      </Grid>
    </Box>
  )}
              {/* Card Body */}
              <Card.Body p={6}>
                <Card.Title fontSize="2xl" fontWeight="bold" textAlign="center">
                  {resource.resource_name || "Unnamed Resource"}
                </Card.Title>
                <Card.Description fontSize="lg" mt={2} color="gray.600">
                  {resource.description || "No description available."}
                </Card.Description>
                
          
                <Box mt={4} >
                  <Text fontSize="md" fontWeight="bold" my={2}>
                    {resource.resource_type || "Unknown"}
                  </Text>
                  
                  <Collapsible.Root unmountOnExit>
                  <Tooltip content="Click for details.">
                  <Collapsible.Trigger >
                   <Heading size="lg" fontWeight="bold" color="gray.700" _hover={{ color: "gray.400", cursor:"pointer"}}>
                     Details
                   </Heading>
            
                    </Collapsible.Trigger>
                   </Tooltip>
  <Collapsible.Content >
                  <Flex direction="column" fontSize="md" fontWeight="medium">
                    {resource.street_address || "Unknown"} <br></br>
                    {resource.city + ", " + resource.state || "Unknown"} <br></br>
                    {resource.zip_code || "Unknown"}
                  </Flex>  
                   <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Longitude</strong> {(resource.longitude) || "Unknown"}
                  </Text> 
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Latitude:</strong> {(resource.latitude) || "Unknown"}
                  </Text>
                 
              
                  <Text fontSize="md" fontWeight="medium" mt={2}>
                    <strong>Community Verified:</strong> {(resource.community_verified) || "Unknown"}
                  </Text>
                  </Collapsible.Content>
                  </Collapsible.Root >

               
                


                  {/* New Accessibility Section */}
                  <Collapsible.Root unmountOnExit>
                  <Tooltip content="Click for details.">
          <Collapsible.Trigger>
            <Heading size="lg" fontWeight="bold" color="gray.700" _hover={{ color: "gray.400", cursor:"pointer"}} >
              Accessibility
            </Heading>
          </Collapsible.Trigger>
          </Tooltip>
          <Collapsible.Content >
        <Box mt={2} 
        >
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
          <Text fontSize="md" my={2}>
            <strong>Commercial Truck Access:</strong>{" "}
            {resource.commercial_truck_access ? "Yes" : "No"}
          </Text>
        </Box>
        </Collapsible.Content>
</Collapsible.Root>
        <Collapsible.Root unmountOnExit>
        {/* New Maintenance Section */}
        <Tooltip content="Click for details.">
        <Collapsible.Trigger >
        
         <Heading size="lg" fontWeight="bold" color="gray.700" _hover={{ color: "gray.400", cursor:"pointer"}}>
           Maintenance
         </Heading>
        </Collapsible.Trigger>
          </Tooltip>
            <Collapsible.Content >
        <Box mt={2}>
          <Text fontSize="md" mt={2}>
            <strong>Street Lights:</strong>{" "}
            {resource.has_street_lights ? "Yes" : "No"}
          </Text>
            
          {resource.resource_type === "Community Fridge" && (
            <Box>
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
            </Box>
          )}

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
        </Collapsible.Content>
        
        </Collapsible.Root >

                  

                  


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
