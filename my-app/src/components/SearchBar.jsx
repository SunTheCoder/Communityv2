import React, { useState } from "react";
import { Field } from "./ui/field";
import { Input } from "@chakra-ui/react";
import { supabase } from "../App"; // Adjust the path to your supabase instance

const SearchBar = ({ resources, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      try {
        if (!query.trim()) return;

        // Search the resources based on the query
        const { data, error } = await supabase
            .from("resources")
            .select("resource_name, resource_type, city")
            .or(
                `resource_name.ilike.%${query}%,resource_type.ilike.%${query}%,city.ilike.%${query}%`
            ); // Match `query` in any of the fields

        if (error) throw error;

        console.log("Search Results:", data);

        // Pass the filtered data to the parent component
        if (onSearch) {
          onSearch(data);
        }
      } catch (error) {
        console.error("Error searching resources:", error.message);
      }
    }
  };

  return (
    <Field maxWidth="250px">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // Trigger on Enter
        placeholder="Search for a resource..."
        variant="outline"
        maxWidth="400px"
      />
    </Field>
  );
};

export default SearchBar;
