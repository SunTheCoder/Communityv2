import React from "react";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
  
    <Provider store={store}>
      <Layout/>
    </Provider>

  );
}

export default App;
