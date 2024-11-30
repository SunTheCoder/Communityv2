import React, { useState } from "react";
import { supabase } from "./SignUp";
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
import { Button, Input, Stack, Textarea, createListCollection } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { HiUpload } from "react-icons/hi"

import {
  DrawerBackdrop,
  DrawerBody,
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
    { label: "Healthcare Professional", value: "Healthcare Professional" },
    { label: "Homeless Shelter", value: "Homeless Shelter" },
    { label: "Nutritionist", value: "Nutritionist" },
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
    { label: "Health Club", value: "Health Club" },
    { label: "Fraternity/Sorority House", value: "Fraternity/Sorority House" },
    { label: "English Language School", value: "English Language School" },
    { label: "Family Resource Center", value: "Family Resource Center" },
    { label: "General Practitioner", value: "General Practitioner" },

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

 
const AddResourceDrawer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  

  const onSubmit = async (data) => {
    setErrorMessage(null);
    console.log(data)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Could not get user. Please log in.");
      }

      const { error } = await supabase.from("resources").insert([
        {
          resource_name: data.resourceName,
          resource_type: data.resourceType.join(),
          description: data.description,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state.join(),
          zip_code: data.zipCode,
          created_by_id: user.id,
        },
      ]);

      if (error) {
        throw new Error("Error adding resource. Please try again.");
      }
      toaster.create({
        title: "Resource Added",
        description: "The resource was successfully added to the database.",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding resource:", error.message);
      setErrorMessage(error.message);

      // Show error toast
      toaster.create({
        title: "Error Adding Resource",
        description: error.message,
        type: "error",
        
        
      });
    }
  };

  return (
    <DrawerRoot size="sm" >

      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button  bg= "gray.400" _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }} variant="solid">
          Add Resource <RiArrowRightLine />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        borderLeftRadius="lg"
        overflow="hidden"
        p={4}
        width="full"
        align="center"
        justify="center"
      >
        <Toaster />
        <DrawerCloseTrigger>
          <CloseButton />
        </DrawerCloseTrigger>
        <DrawerHeader>
          <DrawerTitle>Add Resource</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerBody>
            <Stack spacing={4} py={12}>
              {/* Resource Name Field */}
              <Field
                label="Name"
                invalid={!!errors.resourceName}
                errorText={errors.resourceName?.message}
                required
              >
                <Input
                  placeholder="ex. Thuggin' Fridge"
                  type="text"
                  {...register("resourceName", { required: "Resource name is required" })}
                />
              </Field>

              <Field
                    helperText="Provide an image to make the resource easier to find."
                    >
                    <FileUploadRoot
                        accept={["image/png"]} // Restrict to PNG files
                        directory
                        inputProps={{
                        multiple: false, // Allow single file uploads
                        onChange: (e) => {
                            const file = e.target.files[0];
                            setValue("file", file); // Set the file in the form using react-hook-form's setValue
                            clearErrors("file"); // Clear any previous errors for this field
                        },
                        ref: register("file", {
                            required: "File is required",
                        }).ref, // Attach react-hook-form's ref
                        }}
                    >
                        <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm">
                            <HiUpload /> Upload File
                        </Button>
                        </FileUploadTrigger>
                        <FileUploadList />
                    </FileUploadRoot>
                </Field>
              {/* Resource Type Field */}
              <Field
                label="Resource Type"
                invalid={!!errors.resourceType}
                errorText={errors.resourceType?.message}
                required
              >
                <SelectRoot
                  value={watch("resourceType")}
                  onValueChange={(value) => {
                    console.log("Selected resourceType value:", value.value[0]); // Log the raw value
                    setValue("resourceType", value.value);
                  }}
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

              {/* Description Field */}
              <Field
                label="Description"
                invalid={!!errors.description}
                errorText={errors.description?.message}
                required
              >
                <Textarea
                  placeholder="ex. Community Fridge helps provide essential resources to residents."
                  type="text"
                  {...register("description", { required: "Description is required" })}
                />
              </Field>

              {/* Resource Address Field */}

              <Field
                label="Street Address"
                invalid={!!errors.streetAddress}
                errorText={errors.streetAddress?.message}
                required
              >
                <Input
                  placeholder="ex. 187 Main St"
                  type="text"
                  {...register("streetAddress", { required: "Street address is required" })}
                />
              </Field>

              {/* Resource City Field */}
              <Field
                label="City"
                invalid={!!errors.city}
                errorText={errors.city?.message}
                required
                >
                    <Input
                  placeholder="ex. New York"
                  type="text"
                  {...register("city", { required: "City is required" })}
                  />
              </Field>

              {/* Resource State Field */}
              <Field
                label="State"
                invalid={!!errors.state}
                errorText={errors.state?.message}
                required
                >   
                <SelectRoot
                  value={watch("state")}
                  onValueChange={(value) => 
                    setValue("state", value.value)}
                  collection={states}
                >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select state" />
                    </SelectTrigger>

                    <SelectContent zIndex="1500">
                        <SelectItem item={{ label: "Select State", value: "" }} key="" />
                        {states.items.map((state) => (
                          <SelectItem item={state} key={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
  
                    </SelectContent>

                    </SelectRoot>

                 </Field>


              {/* Zip Code Field */}
              <Field
                label="ZipCode"
                invalid={!!errors.zipCode}
                errorText={errors.zipCode?.message}
                required
              >
                <Input
                  placeholder="ex. 23187"
                  type="text"
                  {...register("zipCode", { required: "Zip code is required" })}
                />
              </Field>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button type="submit" variant="solid" bg= "gray.400" _hover={{ bg: "gray.300", _dark: { bg: "gray.600" } }}>
              Submit <RiArrowRightLine />
            </Button>
          </DrawerFooter>
        </form>
        {/* {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </DrawerContent>
    </DrawerRoot>
  );
};

export default AddResourceDrawer;
