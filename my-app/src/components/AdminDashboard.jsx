import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Access Redux state
import { supabase } from "../App"; // Supabase client
import { Box, Heading, Button, Stack, Text, Input } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { DataListItem, DataListRoot } from "./ui/data-list"

import { Toaster, toaster } from "./ui/toaster";
import AddResourceDrawer from "./AddResourceDrawer";
import { useForm } from "react-hook-form";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.user); // Access user from Redux
  const [resourceRequests, setResourceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

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

  const addCommentToArray = async (newComment, requestId) => {
    try {
      // Fetch existing comments for the request
      const { data: existingData, error: fetchError } = await supabase
        .from("resource_requests")
        .select("comments")
        .eq("id", requestId)
        .single();
  
      if (fetchError) throw new Error("Error fetching existing comments.");
  
      const existingComments = existingData?.comments || [];
  
      // Append the new comment to the existing array
      const updatedComments = [...existingComments, newComment];
  
      // Update the comments array in the database
      const { error: updateError } = await supabase
        .from("resource_requests")
        .update({ comments: updatedComments })
        .eq("id", requestId);
  
      if (updateError) throw new Error("Error updating comments.");
  
      toaster.create({
        title: "Comment Added",
        description: "The new comment was successfully added to the request.",
        type: "success",
      });
  
      // Refresh the list after updating comments
      fetchResourceRequests();
    } catch (error) {
      console.error("Error adding comment to array:", error.message);
      toaster.create({
        title: "Error",
        description: "Could not add the comment.",
        type: "error",
      });
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
        .update({ status: "rejected"})
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
              <Text paddingBottom={2}>Requested By: {request.user_id}</Text>

              <form onSubmit={handleSubmit((data) => addCommentToArray(data.comments, request.id))}>
                <Stack spacing={4}>
                    <Field helperText="Add feedback">
                    <Input
                        type="text"
                        placeholder="ex. Needs community approval."
                        {...register("comments", {
                        // required: "Comment is required", // Validation rule (optional)
                        })}
                    />
                    {errors.comments && (
                        <Text color="red.500" fontSize="sm">
                        {errors.comments.message}
                        </Text>
                    )}
                    </Field>
                    <Box>
                        <Button 
                            type="submit" 
                            bg="gray.400"
                            _hover={{ bg: "gray.500", _dark: { bg: "gray.600" } }}
                            _focus={{ bg: "gray.200", _dark: { bg: "gray.500" } }}
                            
                            >
                        Add Comment
                        </Button>
                    </Box>
                    <DataListRoot>
                    {request.comments.map((comment) => (
                        <DataListItem  label="Feedback:" value={comment}/>
                    ))}
                    </DataListRoot>
                   
                </Stack>
              </form>



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
                  bg= "red.400"
                  _hover={{ bg: "red.500", _dark: { bg: "red.500" } }}
                  _focus={{ bg: "gray.200", _dark: { bg: "red.500" } }}
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
