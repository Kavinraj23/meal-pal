import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
