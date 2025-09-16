import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";     // Make sure App.js exists in src/
import "./App.css";          // Make sure App.css exists in src/

// Debug log to confirm reloads
console.log("✅ index.js loaded - rendering App.js");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
