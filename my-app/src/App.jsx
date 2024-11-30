import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import SplashPage from "./components/pages/SplashPage";
import MainPage from "./components/pages/MainPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect undefined routes */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
