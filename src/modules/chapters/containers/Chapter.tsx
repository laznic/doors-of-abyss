import { Button } from "@/components/ui/button";
import Canvas from "@/components/ui/canvas";
import React, { useRef } from "react";
import { useChapterContext } from "../context/ChapterContext";
import DOMPurify from "dompurify";

export default function Chapter() {
  const { currentChapter, goToNextChapter } = useChapterContext();
  const [action] = currentChapter?.actions || [];
  const canvasRef = useRef<HTMLCanvasElement>();

  function renderActions() {
    switch (action?.action_type) {
      case "DRAW":
        return <Canvas ref={canvasRef} />;
      case "SHOW_PICTURE":
        return (
          <img
            src={DOMPurify.sanitize(currentChapter?.notes.image)}
            alt="Chapter image"
          />
        );
      case "NOTEBOOK_READ":
        return (
          Array.isArray(currentChapter?.notes) &&
          currentChapter?.notes.map((note) => <p key={note.id}>{note.text}</p>)
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

      <Button onClick={goToNextChapter}>Continue</Button>
    </section>
  );
}
