"use client";

import { system } from "../../theme";
import { ColorModeProvider } from "./color-mode";
import { ChakraProvider } from "@chakra-ui/react";

export function Provider(props) {
  console.log(system);

  return (
    <ChakraProvider value={system}> 
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
