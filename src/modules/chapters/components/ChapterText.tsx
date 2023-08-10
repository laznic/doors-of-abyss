import { useAnimate, stagger, usePresence } from "framer-motion";
import React, { useEffect } from "react";
import Splitting from "splitting";

export default function ChapterText({ text }: { text: string }) {
  const [scope, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (text && scope.current) {
      const [output] = Splitting({ target: scope.current, by: "words" });

      if (isPresent) {
        const enterAnimation = async () => {
          for (const word of output.words) {
            animate(
              word,
              {
                opacity: [0, 1],
                scale: [0, 1],
              },
              {
                duration: 0.2,
                delay: stagger(WORDS_PER_MINUTE / output.words.length / 75, {
                  from: getRandomInt(0, output.words.length - 1),
                }),
              },
            );
          }
        };
        enterAnimation();
      } else {
        const exitAnimation = async () => {
          const staggerAmount = WORDS_PER_MINUTE / output.words.length / 75;

          for (const word of output.words) {
            animate(
              word,
              {
                opacity: [1, 0],
                scale: [1, 1.5],
              },
              {
                delay: stagger(staggerAmount, {
                  from: getRandomInt(0, output.words.length - 1),
                }),
              },
            );
          }

          animate(
            scope.current,
            { opacity: 0 },
            { delay: staggerAmount * output.words.length - 0.1 },
          );

          safeToRemove();
        };

        exitAnimation();
      }
    }
  }, [isPresent, safeToRemove, animate, scope, text]);

  return <p ref={scope}>{text}</p>;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const WORDS_PER_MINUTE = 40;
