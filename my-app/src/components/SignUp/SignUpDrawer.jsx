import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import { Box, Stack, Card, Input, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { PasswordInput, PasswordStrengthMeter } from "../ui/password-Input";
import { RiArrowRightLine } from "react-icons/ri";
import { Toaster, toaster } from "../ui/toaster";
import { login } from "../../redux/userSlice";
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
} from "../ui/drawer";
import { supabase } from "../../App";


// Supabase configuration
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabaseUrl = "https://zgskjpeevxlcynqncsps.supabase.co";
// export const supabase = createClient(supabaseUrl, supabaseKey);

const SignUpDrawer = ({ open, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between SignUp/Login
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleSignUp = async (data) => {
    const { email, password, username, avatarUrl } = data;
    setIsLoading(true);
    try {
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toaster.create({ description: authError.message, type: "error" });
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userData.user.id,
        username: username || "New User",
        avatar_url: avatarUrl?.trim() || null,
        role: "user"
      });

      if (profileError) {
        throw new Error("Error creating profile. Please try again.");
      }

      dispatch(
        login({
          id: userData.user.id,
          email,
          username,
          avatarUrl,
          role
        })
      );

      toaster.create({
        description: "Sign Up Successful! Check your email for verification.",
        type: "success",
      });
    } catch (error) {
      toaster.create({ description: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data) => {
    const { email, password } = data;
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toaster.create({ description: authError.message, type: "error" });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        throw new Error("Failed to fetch profile.");
      }

      dispatch(
        login({
          id: authData.user.id,
          email,
          username: profile.username,
          avatarUrl: profile.avatar_url,
          role: profile.role,
        })
      );

      toaster.create({ description: "Login Successful! Welcome back.", type: "success" });
    } catch (error) {
      toaster.create({ description: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerRoot open={open} onOpenChange={onClose} size="xs" placement="start">
      <DrawerBackdrop />
      <DrawerContent
        borderRightRadius="lg"
        border="2px solid"
        borderColor="pink.400"
        borderLeft="none"
        bg="radial-gradient(circle,rgb(230, 191, 186),rgb(232, 189, 243))"
        _dark={{
          borderColor: "pink.600",
          bg: "radial-gradient(circle, #8B4A62, #2C2A35)",
        }}
        mt="73px"
        mb="430px"
      >
        <DrawerHeader>
          <DrawerTitle>{isSignUp ? "Sign Up" : "Login"}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
         
            <Toaster />
            
            <form onSubmit={handleSubmit(isSignUp ? handleSignUp : handleLogin)}>
        <Box maxW="270px">
          <Stack spacing={4}>
            {/* Email Field */}
            <Field
              label="Email"
              errorText={errors.email?.message}
              invalid={!!errors.email}
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
                {/* Username Field */}
                <Field
                  label="Username"
                  errorText={errors.username?.message}
                  invalid={!!errors.username}
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
        </Box>
        <Box justifyContent="space-between">
          <Button 
              variant="solid" 
              onClick={() => setIsSignUp(!isSignUp)}
              signup
              >
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </Button>
          <DrawerActionTrigger asChild>
            <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Submitting..."
                login
            >
                {isSignUp ? "Sign Up" : "Login"} <RiArrowRightLine />
            </Button>
          </DrawerActionTrigger>
        </Box>
      </form>
          
        </DrawerBody>
        <DrawerFooter>
          <DrawerCloseTrigger asChild>
            <Button variant="outline">Close</Button>
          </DrawerCloseTrigger>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default SignUpDrawer;
