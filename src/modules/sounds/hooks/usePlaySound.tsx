import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useSoundContext } from "../context/SoundContext";

export const usePlaySound = (soundName: string, loop?: boolean) => {
  const { soundOn } = useSoundContext();
  const sound = useRef<Howl>();
  const prevSound = useRef<Howl>();
  const prevSoundId = useRef<number>();

  useEffect(() => {
    if (soundOn) {
      sound.current?.fade(1, 0, 2000);

      sound.current = new Howl({
        src: [`/sounds/${soundName}.mp3`],
        loop,
        volume: 0,
        onfade: function (id: string) {
          if (id === prevSoundId) {
            prevSound.current?.unload();
          }
        },
      });

      const id = sound.current.play();
      sound.current.fade(0, 1, 3000);
      prevSound.current = sound.current;
      prevSoundId.current = id;
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
