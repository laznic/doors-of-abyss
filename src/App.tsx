import React from "react";
import Chapters from "./modules/chapters/containers/Chapters";
import SoundToggle from "./modules/sounds/components/SoundToggle";
import { usePlaySound } from "./modules/sounds/hooks/usePlaySound";

function App() {
  usePlaySound("background_loop", true);

  return (
    <main>
      <SoundToggle />
      <Chapters />
    </main>
  );
}

export default App;
