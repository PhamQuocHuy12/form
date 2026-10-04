import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import { startPwa } from "./services/pwa.js";
import { PwaStatus } from "./components/layout/PwaStatus/PwaStatus.jsx";

startPwa();
createRoot(document.getElementById("root")).render(
  <>
    <PwaStatus />
    <App />
  </>,
);
