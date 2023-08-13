// a hook that plays a sound when called, which takes in param of sound name to play and optional param to loop sound
import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useSoundContext } from "../context/SoundContext";

export const usePlaySound = (soundName: string, loop?: boolean) => {
  const { soundOn } = useSoundContext();
  const sound = useRef<Howl>();

  useEffect(() => {
    if (soundOn) {
      sound.current = new Howl({
        src: [`/sounds/${soundName}.mp3`],
        loop,
      });
      sound.current.play();
    } else {
      sound.current?.stop();
    }
  }, [loop, soundName, soundOn]);

  return () => {
    if (sound.current) {
      sound.current.stop();
    }
  };
};
