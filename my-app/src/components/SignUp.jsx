import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input, Text, Link, Box } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";

// Supabase configuration
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = "https://zgskjpeevxlcynqncsps.supabase.co";
export const supabase = createClient(supabaseUrl, supabaseKey);

const SignUp = () => {
  // State for toggling between login and signup
  const [isSignUp, setIsSignUp] = useState(true);

  // Shared form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up specific form state
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // State for messages
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        username
      });

      if (authError) {
        setErrorMessage(authError.message);
        return;
      }

      setSuccessMessage("User signed up. Please check your email to verify your account.");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Step 1: Log in the user
      const { data: { session, user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        username
      });

      if (authError) {
        console.error("Auth error:", authError.message);
        setErrorMessage(authError.message);
        return;
      }

      if (!user) {
        setErrorMessage("Unable to log in. Please try again.");
        return;
      }

      console.log("User logged in:", user);

      // Step 2: Check if the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles") // Explicit schema
        .select("*")
        .eq("id", user.id)
        .single(); // Fetch only one row

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116: No rows found
        console.error("Error checking profile:", fetchError.message);
        setErrorMessage("Error checking profile. Please try again.");
        return;
      }

      // Step 3: Create a profile if it doesn't exist
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from("profiles") // Explicit schema
          .insert([
            {
              id: user.id, // Use the user's ID as the profile ID
              username: username || "New User",
              avatar_url: avatarUrl?.trim() || null,
            },
          ]);

        if (insertError) {
          console.error("Error creating profile:", insertError.message);
          setErrorMessage("Error creating profile. Please try again.");
        } else {
          console.log("Profile successfully created for user:", user.id);
          setSuccessMessage("Logged in and profile created successfully!");
        }
      } else {
        setSuccessMessage("Logged in successfully!");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Box className="auth-container" 
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
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

      <form onSubmit={isSignUp ? handleSignUp : handleLogin}>

        <Field
          label="Email"
          type="email"
          required
          helperText="We'll never share your email with anyone else."
          errorText="Please enter a valid email address."
        >
          <Input
            type="email"
            placeholder="ex. FannieLou@woke.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="Input"
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
          />
        </Field>

        <Field
          label="Password"
          type="password"
          required
          helperText="Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
          errorText="Please enter a valid password."
        >
        <Input
          type="password"
          placeholder="ex. strength2Love"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="Input"
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />
        </Field>

        {isSignUp && (
          <>
          <Field
            label="Username"
            type="text"
            required
            helperText="Must be at least 3 characters long and contain only letters."
            errorText="Please enter a valid username."
            >
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="Input"
                style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
              />
            </Field>

            <Field
              label="Avatar URL (optional)"
              type="text"
              helperText="Provide a URL to an image representing your profile."
              errorText="Please enter a valid URL."
              pattern="^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$"
            >
              <Input
                type="text"
                placeholder="Avatar URL (optional)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="Input"
                style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
              />
            </Field>
          </>
        )}

        <Button
          type="submit"
          className="submit-button"
          size="xs"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </Button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}

      <Text mt="1rem">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          onClick={() => setIsSignUp(!isSignUp)}
          color="blue.500"
          textDecoration="underline"
          cursor="pointer"
        >
          {isSignUp ? "Login" : "Sign Up"}
        </Link>
      </Text>
    </Box>
  );
};

export default SignUp;
