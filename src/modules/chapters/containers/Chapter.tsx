import Canvas from "@/components/ui/canvas";
import React, { useRef, useState } from "react";
import {
  ChapterContextType,
  useChapterContext,
} from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";
import { motion } from "framer-motion";

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
    <motion.section
      layout
      className="mx-auto absolute top-[50%] -translate-y-1/2 max-w-2xl left-0 right-0"
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "-50%" }}
      exit={{ opacity: 0, y: "-60%" }}
    >
      <header>
        {chapter?.image && (
          <div className="w-full bg-neutral-800 h-96" />
          // <motion.img
          //   layout
          //   key={`${chapter?.id}-image`}
          //   initial={{ opacity: 0, scale: 0.9 }}
          //   animate={imageLoaded ? { opacity: 1, scale: 1 } : false}
          //   exit={{ opacity: 0, scale: 0.9 }}
          //   src={DOMPurify.sanitize(chapter?.image)}
          //   alt="Chapter image"
          //   onLoad={() => setImageLoaded(true)}
          // />
        )}

        {renderActions()}
      </header>

      <p>{chapter?.text}</p>

      {hasOptions && (
        <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
      )}
    </motion.section>
  );
}
