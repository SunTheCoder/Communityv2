import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import SplashPage from "./components/pages/SplashPage";
import MainPage from "./components/pages/MainPage";
import { createClient } from "@supabase/supabase-js";
import 'leaflet/dist/leaflet.css';



const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = "https://zgskjpeevxlcynqncsps.supabase.co";
export const supabase = createClient(supabaseUrl, supabaseKey);



function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
