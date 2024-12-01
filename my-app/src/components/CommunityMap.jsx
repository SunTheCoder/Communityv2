import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../App"; // Import your Supabase client setup
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Flex,
} from "@chakra-ui/react";

const ResourceMap = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("id, resource_name, description, latitude, longitude");

        if (error) {
          console.error("Error fetching resources:", error.message);
        } else {
          setResources(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <Flex
    
      direction="column"
      align="center"
    //   justify="center"
      w="full"
      minH="100vh"
      px={5}
      py="75px"
    >
      <VStack spacing={4} mb={6}>
      <Heading as="h2" size="lg" mb={1} textAlign="center">
        Community Resources Map
      </Heading>
        {/* <Text>Explore available resources in your area.</Text> */}
      </VStack>

      {/* Show loading spinner */}
      {loading ? (
        <Flex justify="center" align="center" h="full">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : (
        <Box
          w="full"
          h="80vh"
          borderRadius="md"
          overflow="hidden"
          borderWidth="1px"
          boxShadow="lg"
        >
          <MapContainer
            center={[37.54812, -77.44675]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Add OpenStreetMap Tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Map over resources and add markers */}
            {resources.map((resource) => (
              <Marker
                key={resource.id}
                position={[resource.latitude, resource.longitude]}
              >
                <Popup>
                  <Box p={2} borderRadius="md" boxShadow="lg">
                    <VStack spacing={1} align="start">
                      <Text fontWeight="bold" fontSize="md">
                        {resource.resource_name}
                      </Text>
                      <Text fontSize="sm">{resource.description}</Text>
                    </VStack>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      )}
    </Flex>
  );
};

export default ResourceMap;
