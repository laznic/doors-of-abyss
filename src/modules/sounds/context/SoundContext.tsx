import React, { useContext, createContext, ReactNode, useState } from "react";

export interface SoundContextType {
  soundOn: boolean;
  toggleSound: () => void;
}

export const SoundContext = createContext<SoundContextType>({
  soundOn: false,
  toggleSound: () => null,
});

export function SoundContextProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [soundOn, setSoundOn] = useState(
    JSON.parse(localStorage.getItem("soundOn") || "false"),
  );

  function toggleSound() {
    setSoundOn(!soundOn);
    localStorage.setItem("soundOn", JSON.stringify(!soundOn));
  }

  const contextValue = {
    soundOn,
    toggleSound,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundContext = () => useContext(SoundContext);
