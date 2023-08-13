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
          animate(scope.current, { opacity: 1 });

          for (const word of output.words) {
            animate(
              word,
              {
                opacity: [0, 1],
                scale: [0, 1],
              },
              {
                ease: "easeInOut",
                duration: 0.4,
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
                ease: "easeInOut",
                duration: 0.4,
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
  }, [isPresent]);

  return (
    <div className="relative h-full overflow-hidden max-h-[16dvw] w-2/3 max-w-[800px]">
      <div className="-bottom-[1px] absolute block w-full h-full shadow-[-25px_-25px_60px_-15px_#000_inset] pointer-events-none z-10 " />

      <div className="h-full overflow-y-auto pb-8 pr-8">
        <p
          className="text-[18px] md:text-2xl [&>.word]:opacity-0 opacity-0"
          ref={scope}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const WORDS_PER_MINUTE = 40;
