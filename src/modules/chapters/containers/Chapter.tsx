import { Button } from "@/components/ui/button";
import Canvas from "@/components/ui/canvas";
import React, { useRef } from "react";
import { useChapterContext } from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";

export default function Chapter() {
  const { currentChapter, goToNextChapter } = useChapterContext();
  const [action] = currentChapter?.actions || [];
  const options = currentChapter?.options || [];
  const notes = currentChapter?.notes || [];
  const canvasRef = useRef<HTMLCanvasElement>();
  const hasOptions = options.length > 0;

  useKeyPress("Enter", handleContinue);

  function onOptionSelect(id: number) {
    goToNextChapter?.(id, true);
  }

  function handleContinue() {
    if (options.length > 0) {
      return;
    }

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

  return (
    <section>
      <header>
        {currentChapter?.image && (
          <img
            src={DOMPurify.sanitize(currentChapter?.image)}
            alt="Chapter image"
          />
        )}

        {renderActions()}
      </header>

      <p>{currentChapter?.text}</p>

      {hasOptions && (
        <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
      )}
    </section>
  );
}
