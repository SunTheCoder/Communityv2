import React, { forwardRef } from "react";
import { Box, Field, Input, defineStyle } from "@chakra-ui/react";

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "white",
  px: "0.5",
  top: "-3",
  insetStart: "2",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "all 0.2s ease",
  _peerPlaceholderShown: {
    color: "gray.400",
    top: "2.5",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "blue.500",
    top: "-3",
    insetStart: "2",
  },
});

const InputCustom = forwardRef(({ label, name, placeholder, isRequired, errorText, ...props }, ref) => {
  return (
    <Field.Root invalid={!!errorText} errorText={errorText} required={isRequired}>
      <Box position="relative">
        <Input
          ref={ref}
          className="peer"
          placeholder={placeholder || ""}
          name={name}
          {...props}
        />
        <Field.Label css={floatingStyles}>{label}</Field.Label>
      </Box>
      {errorText && (
        <Box as="span" color="red.500" fontSize="sm">
          {errorText}
        </Box>
      )}
    </Field.Root>
  );
});

export default InputCustom;
