import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChapterContextProvider } from "./modules/chapters/context/ChapterContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!); // eslint-disable-line

root.render(
  <React.StrictMode>
    <ChapterContextProvider>
      <App />
    </ChapterContextProvider>
  </React.StrictMode>
);
