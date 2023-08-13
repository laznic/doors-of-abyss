import React from "react";
import { createRoot } from "react-dom/client";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "./index.css";
import App from "./App";
import { ChapterContextProvider } from "./modules/chapters/context/ChapterContext";
import { SoundContextProvider } from "./modules/sounds/context/SoundContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!); // eslint-disable-line

root.render(
  <React.StrictMode>
    <SoundContextProvider>
      <ChapterContextProvider>
        <App />
      </ChapterContextProvider>
    </SoundContextProvider>
  </React.StrictMode>,
);
