import React, { useState } from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "./ui/drawer";
import { Field } from "./ui/field";
import { Input, Box, Text } from "@chakra-ui/react";
import { supabase } from "../App";

const SearchBar = ({ resources }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Ensure it's a boolean

  const onSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("id, resource_name, resource_type, city")
        .or(
          `resource_name.ilike.%${query}%,resource_type.ilike.%${query}%,city.ilike.%${query}%`
        );

      if (error) throw error;

      setSearchResults(data || []);
      setDrawerOpen(true); // Open the drawer
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  return (
    <>
      {/* Search Input */}
      <Field maxWidth="250px">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Search for a resource..."
          variant="outline"
          maxWidth="400px"
        />
      </Field>

      {/* Drawer */}
      <DrawerRoot
        open={isDrawerOpen} // Ensure this is always a boolean
        onOpenChange={(open) => setDrawerOpen(false)} // Chakra will handle `open` changes
        size="lg"
        placement="end"
        
      >
        <DrawerBackdrop />
        <DrawerContent
            mt="3.75%"
            borderTopLeftRadius="md"
            border="2px solid" borderColor="gray.200" borderBottom="none" bg="gray.200" _dark={{borderColor:"pink.600", bg:"gray.900"}}
        >
          <DrawerHeader>
            <DrawerTitle>Search Results</DrawerTitle>
          </DrawerHeader>

          <DrawerBody>
            {searchResults.length > 0 ? (
              <Box>
                {searchResults.map((result) => (
                  <Box
                    key={result.id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    mb={2}
                    shadow="sm"
                    _hover={{ bg: "gray.100" }}
                  >
                    <Text fontWeight="bold">{result.resource_name}</Text>
                    <Text fontSize="sm">
                      <strong>Type:</strong> {result.resource_type}
                    </Text>
                    <Text 
                        fontSize="sm" 
                        lineClamp="3"
                    >
                      <strong>Description:</strong>{" "}
                      {result.description || "No description available"}
                    </Text>
                  </Box>
                ))}
              </Box>
            ) : (
              <Text>No matching resources found.</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default SearchBar;
