import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Spinner,
  // Divider,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination"; // Adjust the path as needed
import { supabase } from "./SignUp";

const ResourceList = () => {
  const [resources, setResources] = useState([]); // State to hold resources
  const [profiles, setProfiles] = useState({}); // Object to map created_by_id to usernames
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // Loading state

  const itemsPerPage = 6; // Number of resources per page
  const [page, setPage] = useState(1); // Controlled state for current page

  // Fetch resources and profiles from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select("*");

        if (resourcesError) throw new Error(resourcesError.message);

        setResources(resourcesData || []);

        // Extract unique `created_by_id` values and filter out invalid ones
        const profileIds = [
          ...new Set(
            resourcesData
              .map((resource) => resource.created_by_id)
              .filter((id) => id && id !== "null") // Ensure valid IDs
          ),
        ];

        // Fetch profiles from the `profiles` table
        if (profileIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", profileIds);

          if (profilesError) throw new Error(profilesError.message);

          // Map profile IDs to usernames
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

  // Pagination logic
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentResources = resources.slice(startIndex, startIndex + itemsPerPage);

  // Separate featured resource from the rest
  const featuredResource = currentResources[0]; // Highlight the first resource
  const otherResources = currentResources.slice(1);

  return (
    <Box maxW="1200px" mx="auto" textAlign="center" p={6}>
      <Heading as="h2" size="lg" mb={6}>
        Resource List
      </Heading>

      {loading ? (
        <Spinner size="lg" />
      ) : errorMessage ? (
        <Text color="red.500">{errorMessage}</Text>
      ) : resources.length > 0 ? (
        <>
          {/* Featured Resource */}
          {featuredResource && (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              shadow="lg"
              bg="gray.100"
              _dark={{ bg: "gray.700" }}
              mb={8}
              width='500px'
              textAlign="left"
              display='flex'
              justifySelf='center'
              justifyContent='center'
              alignItems='center'
              flexDirection='column'
            >
              <Heading as="h3" size="lg" mb={4}>
                Featured: {featuredResource.resource_name || "Unnamed Resource"}
              </Heading>
              <Text>{featuredResource.description || "No description available."}</Text>
              <Text mt={2}>
                <strong>Location:</strong> {featuredResource.city || "Unknown"}
              </Text>
              <Text>
                <strong>Resource Type:</strong> {featuredResource.resource_type || "Unknown"}
              </Text>
              <Text>
                <strong>Address:</strong> {featuredResource.street_address || "Unknown"}
              </Text>
              <Text>
                <strong>Created At:</strong>{" "}
                {new Date(featuredResource.created_at).toLocaleString()}
              </Text>
              {featuredResource.created_by_id && (
                <Text>
                  <strong>Created By:</strong>{" "}
                  {profiles[featuredResource.created_by_id] || "Unknown User"}
                </Text>
              )}
            </Box>
          )}

          {/* <Divider mb={6} /> */}

          {/* Other Resources */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)", // 1 column on small screens
              md: "repeat(2, 1fr)", // 2 columns on medium screens
              lg: "repeat(3, 1fr)", // 3 columns on large screens
            }}
            gap={6}
          >
            {otherResources.map((resource) => (
              <GridItem
                key={resource.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                shadow="md"
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
                _hover={{ transform: "scale(1.05)" }}
              >
                <Heading as="h3" size="md" mb={2}>
                  {resource.resource_name || "Unnamed Resource"}
                </Heading>
                <Text>{resource.description || "No description available."}</Text>
                <Text mt={2}>
                  <strong>Location:</strong> {resource.city || "Unknown"}
                </Text>
                <Text>
                  <strong>Resource Type:</strong> {resource.resource_type || "Unknown"}
                </Text>
                <Text>
                  <strong>Address:</strong> {resource.street_address || "Unknown"}
                </Text>
                <Text>
                  <strong>Created At:</strong>{" "}
                  {new Date(resource.created_at).toLocaleString()}
                </Text>
                {resource.created_by_id && (
                  <Text>
                    <strong>Created By:</strong>{" "}
                    {profiles[resource.created_by_id] || "Unknown User"}
                  </Text>
                )}
              </GridItem>
            ))}
          </Grid>

          {/* Chakra UI Pagination */}
          <PaginationRoot
            page={page}
            count={resources.length}
            pageSize={itemsPerPage}
            onPageChange={(details) => setPage(details.page)}
          >
            <Box mt={6}>
              <PaginationPrevTrigger />
              <PaginationItems siblingCount={1} />
              <PaginationNextTrigger />
              <PaginationPageText />
            </Box>
          </PaginationRoot>
        </>
      ) : (
        <Text>No resources available.</Text>
      )}
    </Box>
  );
};

export default ResourceList;
