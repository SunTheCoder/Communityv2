import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const buttonRecipe = defineConfig({
  variants: {
    firstFlow: {
      true: {
        borderRadius:"sm",
        maxWidth: "200px",
        boxShadow: "sm",
        fontSize:"xs",
        bg: "radial-gradient(circle, #FFE4E1, #E6E6FA)", // Light pink to lavender
        color: "pink.800", // Default text color
        _dark: {
          bg: "radial-gradient(circle, #8B4A62, #2C2A35)", // Dark mode background
          color: "pink.200", // Dark mode text color
        },
        _hover: {
          bg: "radial-gradient(circle, #F4C4C2, #C8C8E0)",
          
          _dark: {
            bg: "radial-gradient(circle, #732f4f, #1d1c26)", // Dark mode hover background
            // color: "pink.200", // Dark mode hover text color
          },
        },
      },
    },
    login: {
        true: {
            borderRadius: "sm",
            maxWidth: "200px",
            boxShadow: "sm",
            fontSize: "xs",
            bg: "radial-gradient(circle, #FFE4E1, #D0F5D6)", // Light pink to light green
            color: "pink.800", // Default text color
            _dark: {
              bg: "radial-gradient(circle, #8B4A62, #1E392A)", // Dark pink to dark green
              color: "pink.200", // Dark mode text color
            },
            _hover: {
              bg: "radial-gradient(circle, #F4C4C2, #B8E6BE)", // Hover: light pink to soft green
              _dark: {
                bg: "radial-gradient(circle, #732f4f, #183E28)", // Hover: Dark pink to darker green
              },
            },
          },
          
    },
    logout: {
        true: {
            borderRadius: "sm",
            maxWidth: "200px",
            boxShadow: "sm",
            fontSize: "xs",
            bg: "radial-gradient(circle, #FFD1D1, #FFC4C4)", // Light red gradient
            color: "red.800", // Default text color
            _dark: {
              bg: "radial-gradient(circle, #8B0000, #2C1C1C)", // Dark red gradient
              color: "red.200", // Dark mode text color
            },
            _hover: {
              bg: "radial-gradient(circle, #FFB3B3, #FF9999)", // Hover: Lighter red gradient
              _dark: {
                bg: "radial-gradient(circle, #6E0000, #1A0F0F)", // Hover: Darker red gradient
              },
            },
          },
          
    }
  },
});

const customConfig = defineConfig({
  theme: {
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
