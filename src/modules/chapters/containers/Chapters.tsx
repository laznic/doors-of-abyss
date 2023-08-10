import { AnimatePresence } from "framer-motion";
import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";

export default function Chapters() {
  const { currentChapter } = useChapterContext();

  return (
    <AnimatePresence>
      <Chapter key={currentChapter?.id} chapter={currentChapter} />;
    </AnimatePresence>
  );
}
