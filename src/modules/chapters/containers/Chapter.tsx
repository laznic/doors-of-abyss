import Canvas from "@/components/ui/canvas";
import React, { useEffect, useRef, useState } from "react";
import {
  ChapterContextType,
  useChapterContext,
} from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";
import { animate, motion, usePresence } from "framer-motion";
import ChapterText from "../components/ChapterText";

interface ChapterProps {
  chapter: ChapterContextType["currentChapter"];
}

export default function Chapter({ chapter }: ChapterProps) {
  const { goToNextChapter } = useChapterContext();
  const [action] = chapter?.actions || [];
  const options = chapter?.options || [];
  const notes = chapter?.notes || [];
  const canvasRef = useRef<HTMLCanvasElement>();
  const hasOptions = options.length > 0;
  const [ellipsisAnimation, setEllipsisAnimation] = useState();
  const [isPresent, safeToRemove] = usePresence();

  function onOptionSelect(id: number) {
    goToNextChapter?.(id, true);
  }

  function handleContinue() {
    if (options.length > 0) return;

    goToNextChapter?.(action?.id);
  }

  function renderActions() {
    switch (action?.action_type) {
      case "DRAW":
        return <Canvas ref={canvasRef} />;
      case "SHOW_PICTURE":
        return (
          <div className="w-full bg-neutral-800 h-96" />
          // <img src={DOMPurify.sanitize(notes?.[0]?.image)} alt="Action image" />
        );
      case "NOTEBOOK_READ":
        return (
          Array.isArray(notes) &&
          notes.map((note) => <p key={note.id}>{note.text}</p>)
        );
      case "NOTEBOOK_WRITE":
        return <input type="text" />;
      default:
        return null;
    }
  }

  useKeyPress("Enter", handleContinue);

  function startAnimatingEllipse() {
    const animation = animate(
      "ellipse",
      { rx: [380, 390], ry: [290, 275], rotate: [-1, 1] },
      {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    );

    setEllipsisAnimation(animation);
  }

  useEffect(() => {
    if (!isPresent) {
      ellipsisAnimation.stop();
      safeToRemove();
    }
  }, [isPresent, ellipsisAnimation, safeToRemove]);

  return (
    <section className="mx-auto absolute top-[50%] -translate-y-1/2 max-w-2xl left-0 right-0">
      <header>
        <svg
          width="800"
          height="600"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <filter id="displacementFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="6"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="100"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="circleMask">
              <motion.ellipse
                cx="400"
                cy="300"
                fill="white"
                style={{ filter: "url(#displacementFilter)" }}
                initial={{ rx: 0, ry: 0, rotate: 1 }}
                animate={{ rx: 380, ry: 290, rotate: -1 }}
                exit={{ rx: 0, ry: 0, rotate: 1 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                onAnimationComplete={startAnimatingEllipse}
              />
            </mask>
          </defs>
          <image
            // xlinkHref={DOMPurify.sanitize(chapter?.image)}
            xlinkHref={"https://picsum.photos/800/600"}
            width="800"
            height="600"
            mask="url(#circleMask)"
          />
        </svg>

        {renderActions()}
      </header>

      <ChapterText text={chapter?.text} />

      {hasOptions && (
        <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
      )}
    </section>
  );
}
