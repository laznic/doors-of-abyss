import React from "react";
import Chapters from "./modules/chapters/containers/Chapters";
import { usePlaySound } from "./modules/sounds/hooks/usePlaySound";

function App() {
  usePlaySound("background_loop", true);

  return (
    <main className="relative w-full">
      <Chapters />
    </main>
  );
}

export default App;
