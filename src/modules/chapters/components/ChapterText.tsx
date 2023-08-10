import { useAnimate, stagger } from "framer-motion";
import React, { useEffect } from "react";
import Splitting from "splitting";

export default function ChapterText({ text }: { text: string }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (text && scope.current) {
      const [output] = Splitting({ target: scope.current, by: "words" });
      output.words.forEach((word) => {
        animate(
          word,
          {
            opacity: [0, 1],
            scale: [2, 1],
          },
          {
            delay: stagger(WORDS_PER_MINUTE / output.words.length / 75, {
              from: getRandomInt(0, output.words.length - 1),
            }),
          },
        );
      });
    }
  }, [scope, text, animate]);

  return <p ref={scope}>{text}</p>;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const WORDS_PER_MINUTE = 40;
