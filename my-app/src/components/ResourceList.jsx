import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Spinner,
  Image,
  Button,
  Card,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination"; // Adjust the path as needed
import { supabase } from "../App";
import AddResourceDrawer from "./AddResourceDrawer";
import RequestResourceDrawer from "./RequestResourceDrawer";


const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control the drawer
  const [selectedRequest, setSelectedRequest] = useState(null); // To store the selected request

  const [itemsPerPage, setItemsPerPage] = useState(9); // Initial items per page




  // const itemsPerPage = 9;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select("*");

        if (resourcesError) throw new Error(resourcesError.message);

        setResources(resourcesData || []);

        const profileIds = [
          ...new Set(
            resourcesData
              .map((resource) => resource.created_by_id)
              .filter((id) => id && id !== "null")
          ),
        ];

        if (profileIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", profileIds);

          if (profilesError) throw new Error(profilesError.message);

          const profileMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile.username;
            return acc;
          }, {});
          setProfiles(profileMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setErrorMessage("Unable to fetch resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);


  // Adjust itemsPerPage based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(4); // Small screens
      } else if (width < 900) {
        setItemsPerPage(6); // Medium screens
      } else {
        setItemsPerPage(12); // Large screens
      }
    };

    // Run on initial load
    updateItemsPerPage();

    // Add resize listener
    window.addEventListener("resize", updateItemsPerPage);

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentResources = resources.slice(startIndex, startIndex + itemsPerPage);

  const featuredResource = currentResources[0];
  const otherResources = currentResources;

  const onDrawerClose = () => {
    setSelectedRequest(null); // Clear the selected request
    setDrawerOpen(false); // Close the drawer
  };

  return (
    <Box maxW="1200px" mx="auto" textAlign="start" p={6}>
      {/* <Heading as="h2" size="lg" mb={6} textAlign="center">
        Resource List
      </Heading> */}

      {loading ? (
        <Spinner size="lg" />
      ) : errorMessage ? (
        <Text color="red.500">{errorMessage}</Text>
      ) : resources.length > 0 ? (
        <>
          {/* Featured Resource */}
          {/* {featuredResource && (
            <Card.Root
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              shadow="lg"
              bg="gray.100"
              _dark={{ bg: "gray.700" }}
              mb={8}
              textAlign="start"
              maxW="500px"
              mx="auto"
            >
              <Image
                src={featuredResource.image_url || "/no-image.png"}
                alt={featuredResource.resource_name || "Unnamed Resource"}
                height="200px"
                objectFit="cover"
              />
              <Card.Body gap={4}>
                <Card.Title>
                  Featured: {featuredResource.resource_name || "Unnamed Resource"}
                </Card.Title>
                <Card.Description>
                  {featuredResource.description || "No description available."}
                </Card.Description>
                <Text>
                  <strong>Location:</strong> {featuredResource.city || "Unknown"}
                </Text>
                <Text>
                  <strong>Resource Type:</strong>{" "}
                  {featuredResource.resource_type || "Unknown"}
                </Text>
                {/* <Text>
                  <strong>Address:</strong>{" "}
                  {featuredResource.street_address || "Unknown"}
                </Text> */}
                {/* <Text>
                  <strong>Created At:</strong>{" "}
                  {new Date(featuredResource.created_at).toLocaleString()}
                </Text> */}
                {/* {featuredResource.created_by_id && (
                  <Text>
                    <strong>Created By:</strong>{" "}
                    {profiles[featuredResource.created_by_id] || "Unknown User"}
                  </Text>
                )}
              </Card.Body>
            </Card.Root>
          )} */} 

          {/* Other Resources */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {otherResources.map((resource) => (
              <Card.Root
                maxHeight="250px"
                maxWidth="180px"
                size="xs"
                key={resource.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                shadow="md"
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
                _hover={{ transform: "scale(1.02)", border: "1px solid", borderColor: "gray.700", cursor: "pointer" }}

              >
                <Image
                  src={resource.image_url || "/no-image.png"}
                  alt={resource.resource_name || "Unnamed Resource"}
                  height="200px"
                  objectFit="cover"
                />
                <Card.Body gap={2} p={2}>
                  <Card.Title>
                    {resource.resource_name || "Unnamed Resource"}
                  </Card.Title>
                  {/* <Card.Description>
                    {resource.description.split(" ").slice(0,16).join(" ") + "..." || "No description available."}
                  </Card.Description> */}
                  <Text fontSize="sm">
                    <strong>City:</strong> {resource.city || "Unknown"}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Resource Type:</strong>{" "}
                    {resource.resource_type || "Unknown"}
                  </Text>
                  {/* <Text>
                    <strong>Address:</strong> {resource.street_address || "Unknown"}
                  </Text> */}
                  {/* <Text>
                    <strong>Created At:</strong>{" "}
                    {new Date(resource.created_at).toLocaleString()}
                  </Text> */}
                  {/* {resource.created_by_id && (
                    <Text fontSize="sm">
                      <strong>Created By:</strong>{" "}
                      {profiles[resource.created_by_id] || "Unknown User"}
                    </Text>
                  )} */}
                </Card.Body>
              </Card.Root>
            ))}
          </Grid>

          {/* Add Resource Button */}
          {user?.role === "admin" ? (
            <Box py={10} textAlign="center">
              <AddResourceDrawer 
                initialData={selectedRequest}
              />
            </Box>
          ) : user?.role === "user" ? (
            <Box py={10} textAlign="center">
              <RequestResourceDrawer />
            </Box>
          ) : (
            <Box py={10} textAlign="center">
              <p>You do not have access to this feature.</p>
            </Box>
          )}


          {/* Pagination */}
          <Box textAlign="center" p={3}>
            <PaginationRoot
              page={page}
              count={resources.length}
              pageSize={itemsPerPage}
              onPageChange={(details) => setPage(details.page)}
            >
              <Box mt={4}>
                <PaginationPrevTrigger />
                <PaginationItems siblingCount={1} />
                <PaginationNextTrigger />
                <Box py={5}>
                  <PaginationPageText />
                </Box>
              </Box>
            </PaginationRoot>
          </Box>
        </>
      ) : (
        <Text>No resources available.</Text>
      )}
    </Box>
  );
};

export default ResourceList;
