import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
