import React, { useState } from "react";
import { supabase } from "./SignUp";

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
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h2>Add a Resource</h2>

      <form onSubmit={handleAddResource}>
        <input
          type="text"
          placeholder="ex. Lovin' Fridge"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
        />

        <select
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
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
            Select a resource type
        </option>
        <option value="community fridge">Community Fridge</option>
        <option value="social worker">Social Worker</option>
        <option value="mutual aid">Mutual Aid</option>
        <option value="community acupuncture">Community Acupuncture</option>
        <option value="herbalist">Herbalist</option>
        </select>

        <textarea
          placeholder="ex. Lovin' Fridge has wonderful produce regularly stocked..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
            height: "100px",
          }}
        ></textarea>
        <input
          type="text"
          placeholder="ex. 292 Tubman Rd."
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
        />
        <input
          type="text"
          placeholder="ex. Oakland"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
          />
          <select
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
        </select>

        <input
          type="text"
          placeholder="ex. 94608"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
          />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Resource
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
    </div>
  );
};

export default AddResource;
