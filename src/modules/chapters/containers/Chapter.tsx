import Canvas from "@/components/ui/canvas";
import React, { useEffect, useRef, useState } from "react";
import {
  ChapterContextType,
  useChapterContext,
} from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";
import { motion } from "framer-motion";
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
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <section
      layout
      className="mx-auto absolute top-[50%] -translate-y-1/2 max-w-2xl left-0 right-0"
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "-50%" }}
      exit={{ opacity: 0, y: "-60%" }}
    >
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
                initial={{ rx: 380, ry: 290, rotate: -1 }}
                animate={{ rx: 390, ry: 275, rotate: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </mask>
          </defs>
          <image
            xlinkHref={DOMPurify.sanitize(chapter?.image)}
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
