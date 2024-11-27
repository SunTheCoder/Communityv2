import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
    <div className="auth-container" style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

      <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
              style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
            />
            <input
              type="text"
              placeholder="Avatar URL (optional)"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="input"
              style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
            />
          </>
        )}

        <button
          type="submit"
          className="submit-button"
          style={{
            padding: "0.75rem",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}

      <p style={{ marginTop: "1rem" }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default SignUp;
