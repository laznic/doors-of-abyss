import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useSoundContext } from "../context/SoundContext";

export const usePlaySound = (soundName: string, loop?: boolean) => {
  const { soundOn } = useSoundContext();
  const sound = useRef<Howl>();
  const prevSound = useRef<Howl>();
  const prevSoundId = useRef<string>();

  useEffect(() => {
    if (soundOn) {
      if (!soundName) return;

      Howler.unload();

      sound.current = new Howl({
        src: [`/sounds/${soundName}.mp3`],
        loop,
        volume: 0,
      });

      sound.current.play();
      sound.current.fade(0, 1, 3000);
    } else {
      if (!soundName) return;

      sound.current?.stop();
    }
  }, [loop, soundName, soundOn]);

  return () => {
    if (sound.current) {
      sound.current.stop();
    }
  };
};
