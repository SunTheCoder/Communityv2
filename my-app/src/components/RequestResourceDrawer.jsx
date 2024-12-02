import React, { useState } from "react";
import { supabase } from "../App"
import { Field } from "./ui/field";
import { Toaster, toaster } from "./ui/toaster"; // Import the toaster

import { 
  SelectContent, 
  SelectItem, 
  SelectLabel, 
  SelectRoot, 
  SelectTrigger, 
  SelectValueText 
} from "./ui/select";
import { Button, Input, Stack, Textarea, Card, createListCollection, Image } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { HiUpload } from "react-icons/hi"

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerActionTrigger,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { CloseButton } from "./ui/close-button";
import { useForm } from "react-hook-form";
import {
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger,
  } from "./ui/file-upload"
import { geocodeAddress } from "./Layout";

// Resource Types Collection
const resourceTypes = createListCollection({
  items: [
    { label: "Community Fridge", value: "Community Fridge" },
    { label: "Community Garden", value: "Community Garden" },
    { label: "Emotional Support Group", value: "Emotional Support Group" },
    { label: "Residential Safe Space", value: "Residential Safe Space" },
    { label: "Social Worker", value: "Social Worker" },
    { label: "Community Acupuncture", value: "Community Acupuncture" },
    { label: "Herbalist", value: "Herbalist" },
    { label: "Mutual Aid", value: "Mutual Aid" },
    { label: "Homeless Shelter", value: "Homeless Shelter" },
    { label: "Pet Sitter", value: "Pet Sitter" },
    { label: "Psychiatrist", value: "Psychiatrist" },
    { label: "Veterinarian", value: "Veterinarian" },
    { label: "Welfare Coordinator", value: "Welfare Coordinator" },
    { label: "Women's Shelter", value: "Women's Shelter" },
    { label: "Youth Support Group", value: "Youth Support Group" },
    { label: "Adult Daycare", value: "Adult Daycare" },
    { label: "Babysitting", value: "Babysitting" },
    { label: "Childcare", value: "Childcare" },
    { label: "Community Center", value: "Community Center" },
    { label: "Dance Studio", value: "Dance Studio" },
    { label: "Elementary School", value: "Elementary School" },
    { label: "Family Support Group", value: "Family Support Group" },
    { label: "Garden Center", value: "Garden Center" },
    { label: "Library", value: "Library" },
    { label: "Folklore School", value: "Folklore School" },
    { label: "Gymnasium", value: "Gymnasium" },
    { label: "Recreation Club", value: "Recreation Club" },
    { label: "Fraternity/Sorority House", value: "Fraternity/Sorority House" },
    { label: "English Language School", value: "English Language School" },
    { label: "Family Resource Center", value: "Family Resource Center" },
    { label: "Queer Connection Group", value: "Queer Connection Group" },
    { label: "Queer Support Group", value: "Queer Support Group" },
    { label: "Recreation Center", value: "Recreation Center" },
    { label: "Creative Connection Group", value: "Creative Connection Group" },
    { label: "Co-Op / Third Space", value: "Co-Op / Third Space" },
    { lavel: "Activist Group", value: "Activist Group" },
    { label: "Farmer's Market", value: "Farmers Market" },

  ],
});

const states = createListCollection({
    items: [
      { label: "Alabama", value: "AL" },
      { label: "Alaska", value: "AK" },
      { label: "Arizona", value: "AZ" },
      { label: "Arkansas", value: "AR" },
      { label: "California", value: "CA" },
      { label: "Colorado", value: "CO" },
      { label: "Connecticut", value: "CT" },
      { label: "Delaware", value: "DE" },
      { label: "Florida", value: "FL" },
      { label: "Georgia", value: "GA" },
      { label: "Hawaii", value: "HI" },
      { label: "Idaho", value: "ID" },
      { label: "Illinois", value: "IL" },
      { label: "Indiana", value: "IN" },
      { label: "Iowa", value: "IA" },
      { label: "Kansas", value: "KS" },
      { label: "Kentucky", value: "KY" },
      { label: "Louisiana", value: "LA" },
      { label: "Maine", value: "ME" },
      { label: "Maryland", value: "MD" },
      { label: "Massachusetts", value: "MA" },
      { label: "Michigan", value: "MI" },
      { label: "Minnesota", value: "MN" },
      { label: "Mississippi", value: "MS" },
      { label: "Missouri", value: "MO" },
      { label: "Montana", value: "MT" },
      { label: "Nebraska", value: "NE" },
      { label: "Nevada", value: "NV" },
      { label: "New Hampshire", value: "NH" },
      { label: "New Jersey", value: "NJ" },
      { label: "New Mexico", value: "NM" },
      { label: "New York", value: "NY" },
      { label: "North Carolina", value: "NC" },
      { label: "North Dakota", value: "ND" },
      { label: "Ohio", value: "OH" },
      { label: "Oklahoma", value: "OK" },
      { label: "Oregon", value: "OR" },
      { label: "Pennsylvania", value: "PA" },
      { label: "Rhode Island", value: "RI" },
      { label: "South Carolina", value: "SC" },
      { label: "South Dakota", value: "SD" },
      { label: "Tennessee", value: "TN" },
      { label: "Texas", value: "TX" },
      { label: "Utah", value: "UT" },
      { label: "Vermont", value: "VT" },
      { label: "Virginia", value: "VA" },
      { label: "Washington", value: "WA" },
      { label: "West Virginia", value: "WV" },
      { label: "Wisconsin", value: "WI" },
      { label: "Wyoming", value: "WY" },
    ],
      
  })

  
 
const RequestResourceDrawer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  
  const placeholderImage = "https://placehold.co/600x400/png"; // Default placeholder image URL

  const onSubmit = async (data) => {
    setErrorMessage(null);
    console.log(data);
  
    try {
      // Get the currently authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Could not get user. Please log in.");
      }

       // Use placeholder if no file is provided
       const file = watch("file") || placeholderImage;
  
      // Generate full address for geocoding
      const fullAddress = `${data.streetAddress}, ${data.city}, ${data.state} ${data.zipCode}`;
  
      // Fetch latitude and longitude using geocoding
      const coordinates = await geocodeAddress(fullAddress); // Assume geocodeAddress is a helper function
      if (!coordinates) {
        throw new Error("Could not fetch geolocation. Please check the address.");
      }
  
      const { latitude, longitude } = coordinates;
  
      // Insert into the resource_requests table
      const { error } = await supabase.from("resource_requests").insert([
        {
          user_id: user.id, // Authenticated user ID
          name: data.resourceName, // Resource name from form
          type: data.resourceType.join(), // Resource type from form
          description: data.description, // Resource description
          location: {
            street_address: data.streetAddress,
            city: data.city,
            state: data.state.join(),
            zip_code: data.zipCode,
          }, // JSONB location
          latitude: latitude, // Latitude from geocoding
          longitude: longitude, // Longitude from geocoding
          status: "pending", // Default status for a new request
          admin_id: null, // Admin not assigned initially
          comments: null, // No comments on initial submission
          image_url: file === placeholderImage ? placeholderImage : file.name, // Use placeholder or file name
          community_verified: false,
            wheelchair_access: data.wheelchairAccess || false,
            car_access: data.carAccess || false,
            pickup_truck_access: data.pickupTruckAccess || false,
            commercial_truck_access: data.commercialTruckAccess || false,
            has_street_lights: data.hasStreetLights || false,
            last_cleaned: null,
            needs_maintenance: false,
            last_maintenance: null,

        },
      ]);
  
      if (error) {
        throw new Error("Error requesting resource. Please try again.");
      }
  
      toaster.create({
        title: "Resource Request Submitted",
        description: "Your resource request has been submitted for admin review.",
        type: "success",
      });
    } catch (error) {
      console.error("Error requesting resource:", error.message);
      setErrorMessage(error.message);
  
      // Show error toast
      toaster.create({
        title: "Error Requesting Resource",
        description: error.message,
        type: "error",
      });
    }
  };
  

  return (
    <DrawerRoot size="sm">
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button
          bg="gray.400"
          _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
          variant="solid"
        >
          Request Resource <RiArrowRightLine />
        </Button>
      </DrawerTrigger>
      <DrawerContent borderLeftRadius="lg" overflow="hidden" p={4} width="full">
        <Toaster />
        <DrawerCloseTrigger>
          <CloseButton />
        </DrawerCloseTrigger>
        <DrawerHeader>
          <DrawerTitle>Request Resource</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerBody>
            <Card.Root borderWidth="1px" borderRadius="lg" p={4} shadow="md">
              <Card.Header>
                <Card.Title>Resource Details</Card.Title>
                <Card.Description>
                  Fill out the fields below to add a new resource.
                </Card.Description>
              </Card.Header>
              <Card.Body>
                <Stack spacing={4}>
                  <Field
                    label="Name"
                    invalid={!!errors.resourceName}
                    errorText={errors.resourceName?.message}
                    required
                  >
                    <Input
                      placeholder="ex. Thuggin' Fridge"
                      type="text"
                      {...register("resourceName", {
                        required: "Resource name is required",
                      })}
                    />
                  </Field>
                  <Field helperText="Provide an image to make the resource easier to find.">
                  <FileUploadRoot
                        accept={["image/png"]}
                        directory
                        inputProps={{
                            multiple: false,
                            onChange: (e) => {
                            const file = e.target.files[0];
                            setValue("file", file, { shouldValidate: true }); // Validate immediately
                            },
                        }}
                        >
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm">
                          <HiUpload /> Upload File
                        </Button>
                      </FileUploadTrigger>
                      <FileUploadList />
                    </FileUploadRoot>
                    {/* Preview uploaded file or placeholder */}
                    <Image
                      src={
                        watch("file")
                          ? URL.createObjectURL(watch("file"))
                          : placeholderImage
                      }
                      alt="Preview"
                      style={{ width: "100px", height: "100px", marginTop: "10px" }}
                    />
                  </Field>
                  <Field
                    label="Resource Type"
                    invalid={!!errors.resourceType}
                    errorText={errors.resourceType?.message}
                    required
                  >
                    <SelectRoot
                      value={watch("resourceType")}
                      onValueChange={(value) =>
                        setValue("resourceType", value.value)
                      }
                      collection={resourceTypes}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent zIndex="1500">
                        {resourceTypes.items.map((type) => (
                          <SelectItem item={type} key={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Field>
                  <Field
                    label="Description"
                    invalid={!!errors.description}
                    errorText={errors.description?.message}
                    required
                  >
                    <Textarea
                      placeholder="Describe the resource."
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                  </Field>
                  <Field
                    label="Street Address"
                    invalid={!!errors.streetAddress}
                    errorText={errors.streetAddress?.message}
                    required
                  >
                    <Input
                      placeholder="123 Main St"
                      {...register("streetAddress", {
                        required: "Street address is required",
                      })}
                    />
                  </Field>
                  <Field
                    label="City"
                    invalid={!!errors.city}
                    errorText={errors.city?.message}
                    required
                  >
                    <Input
                      placeholder="ex. New York"
                      {...register("city", { required: "City is required" })}
                    />
                  </Field>
                  <Field
                    label="State"
                    invalid={!!errors.state}
                    errorText={errors.state?.message}
                    required
                  >
                    <SelectRoot
                      value={watch("state")}
                      onValueChange={(value) => setValue("state", value.value)}
                      collection={states}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent zIndex="1500">
                        {states.items.map((state) => (
                          <SelectItem item={state} key={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Field>
                  <Field
                    label="Zip Code"
                    invalid={!!errors.zipCode}
                    errorText={errors.zipCode?.message}
                    required
                  >
                    <Input
                      placeholder="ex. 23187"
                      {...register("zipCode", {
                        required: "Zip code is required",
                      })}
                    />
                  </Field>
                </Stack>
              </Card.Body>
            </Card.Root>
          </DrawerBody>
          <DrawerFooter justifyContent="flex-end" gap={4}>
            <DrawerActionTrigger>
                <Button
                type="button"
                variant="outline"
                onClick={() =>
                    toaster.create({ title: "Canceled", type: "info" })
                }
                >
                Cancel
                </Button>
            </DrawerActionTrigger>
            <DrawerActionTrigger asChild>
                <Button
                type="submit"
                variant="solid"
                bg="gray.400"
                _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}
                >
                Submit <RiArrowRightLine />
                </Button>
            </DrawerActionTrigger>
          </DrawerFooter>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </DrawerContent>
    </DrawerRoot>
  );
};

export default RequestResourceDrawer;
