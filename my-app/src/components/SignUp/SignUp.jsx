import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import { Box, Stack, Card, Input, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { RiArrowRightLine } from "react-icons/ri";
import { Toaster, toaster } from "@/components/ui/toaster";
import { login, logout } from "../../redux/userSlice";
import { supabase } from "../../App";
import AddResourceDrawer from "../AddResourceDrawer";

// Supabase configuration
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabaseUrl = "https://zgskjpeevxlcynqncsps.supabase.co";
// export const supabase = createClient(supabaseUrl, supabaseKey);

const SignUp = ({navigate}) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between SignUp/Login
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user); // Fetch user from Redux store
  const dispatch = useDispatch();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleSignUp = async (data) => {
    const { email, password, username, avatarUrl, zipCode } = data;

    setIsLoading(true);
    try {
      // Sign up with Supabase
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toaster.create({
          description: authError.message,
          type: "error",
        });
        return;
      }

      // Insert profile into database
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userData.user.id,
        username: username || "New User",
        email: email,
        avatar_url: avatarUrl?.trim() || null,
        zip_code: zipCode,
      });

      if (profileError) {
        throw new Error("Error creating profile. Please try again.");
      }

      // Dispatch login to Redux
      dispatch(
        login({
          id: userData.user.id,
          email,
          username,
          avatarUrl,
          zipCode,
        })
      );

      navigate("/main");

      toaster.create({
        description: "Sign Up Successful! Check your email for verification.",
        type: "success",
      });

    } catch (error) {
      toaster.create({
        description: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data) => {
    const { email, password } = data;

    setIsLoading(true);
    try {
      // Login with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toaster.create({
          description: authError.message,
          type: "error",
        });
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        throw new Error("Failed to fetch profile.");
      }

      // Dispatch login to Redux
      dispatch(
        login({
          id: authData.user.id,
          email,
          username: profile.username,
          avatarUrl: profile.avatar_url,
          zipCode: profile.zip_code,
        })
      );

      navigate("/main");

      toaster.create({
        description: "Login Successful! Welcome back.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        description: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card.Root maxW="sm" mx="auto" mt={8} shadow="lg" _dark={{ bg: "gray.800" }}>
      <Toaster />
      <Card.Header>
        <Card.Title>{isSignUp ? "Sign Up" : "Login"}</Card.Title>
        <Card.Description>
          {isSignUp
            ? "Create an account to get started."
            : "Enter your credentials to log in."}
        </Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(isSignUp ? handleSignUp : handleLogin)}>
        <Card.Body>
          <Stack spacing={4}>
            {/* Email Field */}
            <Field
              label="Email"
              errorText={errors.email?.message}
              invalid={!!errors.email}
              required
            >
              <Input
                variant='subtle'
                type="email"
                placeholder="ex. FannieLou@woke.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </Field>

            {/* Password Field */}
            <Field
              label="Password"
              errorText={errors.password?.message}
              invalid={!!errors.password}
              required
            >
              <Stack>
                <PasswordInput
                  variant='subtle'
                  placeholder="ex. password123"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {isSignUp && (
                  <PasswordStrengthMeter value={watch("password")?.length || 0} />
                )}
              </Stack>
            </Field>

            {isSignUp && (
              <>
              {/* Confirm Password Field */}
                <Field
                  label="Confirm Password"
                  errorText={errors.confirmPassword?.message}
                  invalid={!!errors.confirmPassword}
                  required
                >
                  <PasswordInput
                    variant='subtle'
                    placeholder="ex. password123"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                </Field>
                {/* Username Field */}
                <Field
                  label="Username"
                  errorText={errors.username?.message}
                  invalid={!!errors.username}
                  required
                >
                  <Input
                    variant='subtle'
                    type="text"
                    placeholder="ex. MLK2025"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                  />
                </Field>

                {/* ZipCode Field */}
                <Field
                  label="Zip Code"
                  errorText={errors.zipCode?.message}
                  invalid={!!errors.zipCode}
                  required
                >
                  <Input
                    variant='subtle'
                    type="zip code"
                    placeholder="ex. 23224"
                    {...register("zipCode", {
                      required: "Zip code is required",
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: "Invalid zip code",
                      },

                    })}
                  />
                </Field>

                {/* Avatar URL Field */}
                <Field
                  label="Avatar URL (Optional)"
                  errorText={errors.avatarUrl?.message}
                  invalid={!!errors.avatarUrl}
                >
                  <Input
                    variant='subtle'
                    type="url"
                    placeholder="ex. https://example.com/avatar.jpg"
                    {...register("avatarUrl", {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
                        message: "Invalid URL",
                      },
                    })}
                  />
                </Field>
              </>
            )}
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="space-between">
          <Button 
              variant="solid" 
              onClick={() => setIsSignUp(!isSignUp)}
              signup
              >
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
            login
          >
            {isSignUp ? "Sign Up" : "Login"} <RiArrowRightLine />
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  );
};

export default SignUp;
