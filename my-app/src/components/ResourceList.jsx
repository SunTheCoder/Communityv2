import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Spinner,
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
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // Loading state

  const itemsPerPage = 6; // Number of resources per page
  const [page, setPage] = useState(1); // Controlled state for current page

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources") // Replace "resources" with your actual table name
        .select("*"); // Select all columns, or specify columns as needed

      if (error) {
        console.error("Error fetching resources:", error.message);
        setErrorMessage("Unable to fetch resources. Please try again later.");
      } else {
        setResources(data || []); // Set resources data or an empty array
      }
      setLoading(false);
    };

    fetchResources();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Pagination logic
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentResources = resources.slice(startIndex, startIndex + itemsPerPage);

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
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)", // 1 column on small screens
              md: "repeat(2, 1fr)", // 2 columns on medium screens
              lg: "repeat(3, 1fr)", // 3 columns on large screens
            }}
            gap={6}
          >
            {currentResources.map((resource) => (
              <GridItem
                key={resource.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                shadow="md"
                bg="gray.100"
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
                    <strong>Created By:</strong> {resource.created_by_id}
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
