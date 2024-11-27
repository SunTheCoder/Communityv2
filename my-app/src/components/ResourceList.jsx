import React, { useState, useEffect } from "react";
import { supabase } from "./SignUp";

const ResourceList = () => {
  const [resources, setResources] = useState([]); // State to hold resources
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources") // Replace "resources" with your actual table name
        .select("*"); // Select all columns, or specify columns as needed

      if (error) {
        console.error("Error fetching resources:", error.message);
        setErrorMessage("Unable to fetch resources. Please try again later.");
      } else {
        setResources(data || []); // Set resources data or an empty array
      }
    };

    fetchResources();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2>Resource List</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li
              key={resource.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{resource.resource_name || "Unnamed Resource"}</h3>
              <p>{resource.description || "No description available."}</p>
              <p>
                <strong>Location:</strong> {resource.city || "Unknown"}
              </p>
              <p>
                <strong>Resource Type:</strong> {resource.resource_type || "Unknown"}
              </p>
              <p>
                <strong>Address:</strong> {resource.street_address || "Unknown"}
              </p>
              <p>
                <strong>Created At:</strong> {resource.created_at.toLocaleString()}
              </p>
              {resource.created_by_id && (
                <p>
                  <strong>Created By:</strong> {resource.created_by_id}
                </p>
              )}
            </li>
          ))
        ) : (
          <p>No resources available.</p>
        )}
      </ul>
    </div>
  );
};

export default ResourceList;
