import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Access Redux state
import { supabase } from "../App"; // Supabase client
import { Box, Heading, Button, Stack, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import AddResourceDrawer from "./AddResourceDrawer";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.user); // Access user from Redux
  const [resourceRequests, setResourceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch all resource requests (only for admins)
  const fetchResourceRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resource_requests")
        .select("*");

      if (error) {
        throw new Error("Error fetching resource requests.");
      }

      setResourceRequests(data);
    } catch (error) {
      console.error("Error fetching resource requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve a resource request
  const approveRequest = (request) => {
    setSelectedRequest(request); // Set the selected request for pre-filling
    setDrawerOpen(true); // Open the AddResourceDrawer
    console.log("Drawer Open:", drawerOpen); // Debugging
    console.log("Selected Request:", selectedRequest);


  };

  const rejectRequest = async (id) => {
    try {
      const { error } = await supabase
        .from("resource_requests")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) {
        throw new Error("Error rejecting request.");
      }

      toaster.create({
        title: "Request Rejected",
        description: `The request with ID ${id} has been rejected.`,
        type: "success",
      });

      fetchResourceRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      toaster.create({
        title: "Error",
        description: "Could not reject the request.",
        type: "error",
      });
    }
  };

  const onDrawerClose = () => {
    setSelectedRequest(null);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (user.role === "admin") {
      fetchResourceRequests();
    }
  }, [user.role]);

  if (user.role !== "admin") {
    return <Text>You do not have access to this page.</Text>;
  }

  return (
    <Box p={6}>
      <Toaster />
      <Heading as="h1" size="lg" mb={4}>
        Admin Dashboard
      </Heading>

      {loading ? (
        <Text>Loading resource requests...</Text>
      ) : resourceRequests.length === 0 ? (
        <Text>No pending resource requests.</Text>
      ) : (
        <Stack spacing={4}>
          {resourceRequests.map((request) => (
            <Box
              key={request.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              shadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                {request.name}
              </Heading>
              <Text>Description: {request.description}</Text>
              <Text>Status: {request.status}</Text>
              <Text>Requested By: {request.user_id}</Text>
              <Stack direction="row" spacing={4} mt={4}>
                {/* <Button
                  colorScheme="green"
                  onClick={() => approveRequest(request)}
                >
                  Approve
                </Button> */}
                <AddResourceDrawer
                
                initialData={request}
                />
                <Button
                  colorScheme="red"
                  onClick={() => rejectRequest(request.id)}
                >
                  Reject
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* AddResourceDrawer for admins to add resources */}
      {drawerOpen && (
        <AddResourceDrawer
          isOpen={drawerOpen}
          onClose={onDrawerClose}
          initialData={selectedRequest} // Pass pre-filled data
        />
      )}
    </Box>
  );
};

export default AdminDashboard;
