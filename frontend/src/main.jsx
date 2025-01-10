import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* remove strictmode when testing the application and data is being fetched twice */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
