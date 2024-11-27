import React from "react";
import SignUp from "./components/SignUp"; // Import your SignUp/Login component
import AddResource from "./components/AddResource"; // Import your AddResource componentq
import ResourceList from "./components/ResourceList";

function App() {
  return (
    <div>
      {/* Render the SignUp component */}
      <SignUp />
      <AddResource /> 
      <ResourceList/>
    </div>
  );
}

export default App;
