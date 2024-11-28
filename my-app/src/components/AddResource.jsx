import React, { useState } from "react";
import { supabase } from "./SignUp";
import { Field } from "./ui/field"
import {  SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText } from "./ui/select";
import { Button } from "./ui/button";
import { Input, Textarea, Box, createListCollection } from "@chakra-ui/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri"



const AddResource = () => {
  const [resourceName, setResourceName] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resourceTypes = createListCollection({
    items: [
      { label: "Community Fridge", value: "Community Fridge" },
      { label: "Social Worker", value: "Social Worker" },
      { label: "Community Acupuncture", value: "Community Acupuncture" },
      { label: "Herbalist", value: "Herbalist" },
      { label: "Mutual Aid", value: "Mutual Aid" },
    ],
  })

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

  const handleAddResource = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Fetch the current user's ID
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error("Could not get user. Please log in.");
      }

      // Insert the new resource into the table
      const { error } = await supabase.from("resources").insert([
        {
            resource_name: resourceName,
            resource_type: resourceType,
            description: description,
            street_address: streetAddress,
            city,
            state,
            zip_code: zipCode,
            created_by_id: user.id, // Assuming you have a "created_by_id" column
        },
      ]);

      if (error) {
        throw new Error("Error adding resource. Please try again.");
      }

      setSuccessMessage("Resource added successfully!");
      setResourceName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding resource:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
        // bg="gray.800" // Dark gray background
        // color="whiteAlpha.900" // Slightly off-white text for readability
        p={6} // Padding around the content
        borderRadius="lg" // Rounded corners
        shadow="lg" // Subtle shadow for depth
        border="1px" // Thin border
        borderColor="gray.700" // Border color slightly lighter than background
        _hover={{  transform: "scale(1.02)" }} // Hover effect
        transition="all 0.3s ease" // Smooth animation
        maxW="380px" // Limit the maximum width
        mx="auto" // Center horizontally
        mt={4} // Margin at the top    
    >
      <h2>Add a Resource</h2>

      <form onSubmit={handleAddResource}>
        <Field
        label="Resource Name"
        type="text"
        
        required
        >
            <Input
                type="text"
                placeholder="ex. Lovin' Fridge"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
        
            
            />
        </Field>

        <Field
         label="Resource Type"
         type="text"
         required
         >
            <SelectRoot 
                collection={resourceTypes} 
                size="sm" width="320px" 
                value={resourceType} 
                onValueChange={(e) => {
                    console.log("Selected value:", e.value);
                    setResourceType(e.value);
                  }}
                    >
            <SelectLabel>Select Type</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
                {resourceTypes.items.map((type) => (
                <SelectItem item={type} key={type.value}>
                    {type.label}
                </SelectItem>
                ))}
                
            </SelectContent>
            </SelectRoot>

         

        </Field>
   {/* <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            required
       
            >
            <option value="" disabled>
                Select a resource type
            </option>
            <option value="community fridge">Community Fridge</option>
            <option value="social worker">Social Worker</option>
            <option value="mutual aid">Mutual Aid</option>
            <option value="community acupuncture">Community Acupuncture</option>
            <option value="herbalist">Herbalist</option>
            </select> */}
        <Field
         label= "Description"
         type="text"
         helperText="Please provide a brief description of the resource."
         errorText='Decsription is required'
         required
        >
            <Textarea
            placeholder="ex. Lovin' Fridge has wonderful produce regularly stocked..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
           
            ></Textarea>
        </Field>

        <Field
            label="Street Address"
            type="text"
            required
            helperText="Please provide the street address of the resource."
            errorText='Street Address is required'
        >
            <Input
            type="text"
            placeholder="ex. 292 Tubman Rd."
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            required
            
            />
        </Field>

        <Field
            label="City"
            type="text"
            required
            helperText="Please provide the city of the resource."
            errorText='City is required'
        >
        <Input
          type="text"
          placeholder="ex. Oakland"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
         
          />
          </Field>


        <Field
            label="State"
            type="text"
            required
            helperText="Please provide the state of the resource."
            errorText='State is required'
            >

            <SelectRoot 
                collection={states} 
                size="sm" width="320px"   
                value={state}
                onValueChange={(e) => {
                    console.log("Selected value:", e.value);
                    setState(e.value)
                }}
                >
                <SelectLabel>Select State</SelectLabel>
                <SelectTrigger>
                    <SelectValueText placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                    {states.items.map((state) => (
                    <SelectItem item={state} key={state.value}>
                        {state.label}
                    </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>

          {/* <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        required
        style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
        }}
        >
        <option value="" disabled>
            Select a state
        </option>
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
        </select> */}

        </Field>

        <Field
            label="Zip Code"
            type="text"
            required
            helperText="Please provide the zip code of the resource."
            errorText='Zip Code is required'
        >

        <Input
          type="text"
          placeholder="ex. 94608"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          
          />
          
          </Field>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
            colorScheme="blue"
            variant="solid"
            size="xs"
            disabled={isLoading} // Optional if isLoading handles this
            marginTop="1rem"
            bgColor="teal.600"
            >
            Add Resource <RiArrowRightLine />
        </Button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
    </Box>
  );
};

export default AddResource;
