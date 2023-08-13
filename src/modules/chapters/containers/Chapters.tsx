import SoundToggle from "@/modules/sounds/components/SoundToggle";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";

export default function Chapters() {
  const { currentChapter } = useChapterContext();

  return (
    <AnimatePresence mode={"wait"}>
      <div className="absolute right-4 top-4">
        <SoundToggle />
      </div>
      <Chapter key={currentChapter?.id} chapter={currentChapter} />;
    </AnimatePresence>
  );
}
