import React, { useState } from "react";
import { supabase } from "./SignUp";
import { Field } from "./ui/field";
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

// Resource Types Collection
const resourceTypes = createListCollection({
  items: [
    { label: "Community Fridge", value: "Community Fridge" },
    { label: "Social Worker", value: "Social Worker" },
    { label: "Community Acupuncture", value: "Community Acupuncture" },
    { label: "Herbalist", value: "Herbalist" },
    { label: "Mutual Aid", value: "Mutual Aid" },
  ],
});

const AddResourceDrawer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Could not get user. Please log in.");
      }

      const { error } = await supabase.from("resources").insert([
        {
          resource_name: data.resourceName,
          resource_type: data.resourceType,
          description: data.description,
          streetAddress: data.streetAddress,
          zip_code: data.zipCode,
          created_by_id: user.id,
        },
      ]);

      if (error) {
        throw new Error("Error adding resource. Please try again.");
      }

      setSuccessMessage("Resource added successfully!");
    } catch (error) {
      console.error("Error adding resource:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <DrawerRoot size="sm">
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="outline">
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

              {/* Resource Type Field */}
              <Field
                label="Resource Type"
                invalid={!!errors.resourceType}
                errorText={errors.resourceType?.message}
                required
              >
                <SelectRoot
                  value={watch("resourceType")}
                  onValueChange={(value) => setValue("resourceType", value)}
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
            <Button type="submit" variant="solid">
              Submit <RiArrowRightLine />
            </Button>
          </DrawerFooter>
        </form>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </DrawerContent>
    </DrawerRoot>
  );
};

export default AddResourceDrawer;
