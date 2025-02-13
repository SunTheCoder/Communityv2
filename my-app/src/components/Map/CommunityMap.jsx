import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../App"; // Import your Supabase client setup
import L from 'leaflet'; // Add this import
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Flex,
  Image,
} from "@chakra-ui/react";

// Fix for default marker icons in production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ResourceMap = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("id, resource_name, resource_type, description, latitude, longitude, image_url");

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
      direction="row"
      justify="space-around"
      w="full"
      minH="100vh"
      py="45px"
    >
      <VStack spacing={4} mb={6}>
      {/* <Heading as="h2" size="lg" mb={1} textAlign="center">
        Community Resources Map
      </Heading> */}
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
          shadow="sm"
          mt={1}
          position="relative"
        >
          <MapContainer
            center={[37.54812, -77.44675]}
            zoom={13}
            style={{ 
              height: "100%", 
              width: "100%",
              position: "relative",
              zIndex: 1
            }}
            scrollWheelZoom={true}
          >
            {/* Add OpenStreetMap Tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />

            {/* Map over resources and add markers */}
            {resources.map((resource) => (
              <Marker
                key={resource.id}
                position={[resource.latitude, resource.longitude]}
              >
                <Popup>
                  
                    <VStack p={2} borderRadius="md" boxShadow="lg" spacing={2} align="start">
                      <Text fontWeight="bold" fontSize="md">
                        {resource.resource_name}
                      </Text>
                      <Text fontWeight="bold" fontSize="sm">
                        {resource.resource_type}
                      </Text>
                      
                      {resource.image_url && (
                        <Box 
                          width="200px" 
                          height="150px" 
                          overflow="hidden" 
                          borderRadius="md"
                        >
                          <Image
                            src={resource.image_url}
                            alt={resource.resource_name}
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </Box>
                      )}
                      
                      <Text fontSize="sm">{resource.description}</Text>
                    </VStack>
              
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
