import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const buttonRecipe = defineConfig({
  variants: {
    firstFlow: {
      true: {
        borderRadius:"md",
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
