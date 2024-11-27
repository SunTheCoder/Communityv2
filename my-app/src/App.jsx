import React from "react";
import SignUp from "./components/SignUp"; // Import your SignUp/Login component
import AddResource from "./components/AddResource"; // Import your AddResource componentq
import ResourceList from "./components/ResourceList";
import Demo from "./components/Demo"; // Import your Demo component

function App() {
  return (
    <div>
      {/* Render the SignUp component */}
      <SignUp />
      <AddResource /> 
      <ResourceList/>
      <Demo /> {/* Render the Demo component */}
    </div>
  );
}

export default App;
