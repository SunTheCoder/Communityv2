import React from 'react';
import { Input } from '@chakra-ui/react';
import { Field } from "./ui/field"

const Demo = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000); // Simulate an API call
    };
  
    return (
      <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", textAlign: "center" }}>
        <Field
          label="Email"
          type="email"
          placeholder="Enter your email address"
          required
          errorText={!email ? "Please enter a valid email address" : ""}
          helperText="We'll never share your email with anyone else."
          optionalText="Optional"
          onChange={handleEmailChange}
          disabled={isLoading}
        >
              <Input />

        </Field>
        <button
          onClick={handleClick}
          disabled={isLoading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: isLoading ? "#ccc" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginTop: "1rem",
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    );
  };
  
  export default Demo;