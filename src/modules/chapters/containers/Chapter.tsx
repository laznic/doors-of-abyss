import Canvas from "@/components/ui/canvas";
import React, { useRef } from "react";
import {
  ChapterContextType,
  useChapterContext,
} from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";
import { AnimatePresence, motion } from "framer-motion";

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
          <img
            src={DOMPurify.sanitize(notes?.[0]?.image)}
            alt="Chapter image"
          />
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
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <header>
          {chapter?.image && (
            <img src={DOMPurify.sanitize(chapter?.image)} alt="Chapter image" />
          )}

          {renderActions()}
        </header>

        <p>{chapter?.text}</p>

        {hasOptions && (
          <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
        )}
      </motion.section>
    </AnimatePresence>
  );
}
