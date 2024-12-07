import React, { useState, useEffect, useRef } from "react";
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
  
  Input,
  createListCollection
} from "@chakra-ui/react";
import States from "../states"
import Types from "../resourceTypes"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
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
import ResourceDetailsModal from "./ResourceDetailsDrawer";

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  
  const [profiles, setProfiles] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control the drawer
  const [selectedRequest, setSelectedRequest] = useState(null); // To store the selected request
  const [selectedResourceId, setSelectedResourceId] = useState(null); // Track selected resource ID for modal

  const [filterType, setFilterType] = useState(""); // Filter by resource type
  const [filterState, setFilterState] = useState(""); // Filter by state
  const [filterCity, setFilterCity] = useState(""); // Filter by city
  const [itemsPerPage, setItemsPerPage] = useState(9); // Initial items per page

  const drawerRef = useRef(); // Ref for the drawer trigger



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

  
  const handleCardClick = (resourceId) => {
    setSelectedResourceId(resourceId); // Set the selected resource ID
    if (drawerRef.current) {
      drawerRef.current.click(); // Trigger the drawer programmatically
    }
  };

  const handleTypeFilter = () => {
    
  }
  
  // Filter logic for resources based on selected state
  const filteredResources = resources.filter((resource) => {
    // Check for state filter
    if (filterState && filterState.length > 0) {
      const selectedState = filterState.join(""); // Convert array ['VA'] to string 'VA'
      if (resource.state !== selectedState) {
        return false; // Exclude resource if state doesn't match
      }
    }
  
    // Check for type filter
    if (filterType && filterType.length > 0) {
      const selectedType = filterType.join(""); // Convert array ['Community Fridge'] to string
      if (resource.resource_type !== selectedType) {
        return false; // Exclude resource if type doesn't match
      }
    }
  
    return true; // Include resource if it passes all filters
  });
  

// Paginate the filtered resources
const paginatedResources = filteredResources.slice(
  startIndex,
  startIndex + itemsPerPage
);

  return (
    <Box mt="46.3px">
      <Box display="flex"  justifyContent="space-evenly" gap={4}  m={6}>
      <SelectRoot
  collection={Types}
  value={filterType}
  onValueChange={(selectedItem) => setFilterType([selectedItem.value])} // Wrap in array
  width="320px"
>
  <SelectTrigger>
    <SelectValueText placeholder="Filter by Type" />
  </SelectTrigger>
  <SelectContent>
    {Types.items.map((type) => (
      <SelectItem item={type} key={type.value}>
        {type.label}
      </SelectItem>
    ))}
  </SelectContent>
</SelectRoot>

        <SelectRoot
  collection={States}
  value={filterState}
  onValueChange={(selectedItem) => setFilterState([selectedItem.value])} // Wrap in array
  width="320px"
>
  <SelectTrigger>
    <SelectValueText placeholder="Filter by State" />
  </SelectTrigger>
  <SelectContent>
    {States.items.map((state) => (
      <SelectItem item={state} key={state.value}>
        {state.label}
      </SelectItem>
    ))}
  </SelectContent>
</SelectRoot>

      <Input
  placeholder="Filter by City"
  value={filterCity}
  onChange={(e) => setFilterCity(e.target.value)}
  maxWidth="200px"
/>
      </Box>


    <ResourceDetailsModal
    resourceId={selectedResourceId}
    trigger={
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
            {paginatedResources.map((resource) => (
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
    _hover={{
      transform: "scale(1.02)",
      border: "1px solid",
      borderColor: "gray.700",
      cursor: "pointer",
    }}
    onClick={() => handleCardClick(resource.id)} // Open drawer for the clicked resource
  >
    <Image
      src={resource.image_url || "/no-image.png"}
      alt={resource.resource_name || "Unnamed Resource"}
      height="200px"
      objectFit="cover"
    />
    <Card.Body gap={2} p={2}>
      <Card.Title>{resource.resource_name || "Unnamed Resource"}</Card.Title>
      <Text fontSize="sm">
        <strong>City:</strong> {resource.city || "Unknown"}
      </Text>
      <Text fontSize="sm">
        <strong>Resource Type:</strong> {resource.resource_type || "Unknown"}
      </Text>
    </Card.Body>
  </Card.Root>
))}


          </Grid>
          


         
        </>
      ) : (
        <Text>No resources available.</Text>
      )}
      
    </Box>
    }
    />
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
    </Box>
  );
};

export default ResourceList;
