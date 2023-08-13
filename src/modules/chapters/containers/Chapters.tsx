import SoundToggle from "@/modules/sounds/components/SoundToggle";
import { usePlaySound } from "@/modules/sounds/hooks/usePlaySound";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";

export default function Chapters() {
  const { currentChapter } = useChapterContext();
  usePlaySound(currentChapter?.loop_sound || "", true);

  return (
    <>
      <div className="absolute right-4 top-4">
        <SoundToggle />
      </div>
      <AnimatePresence mode={"wait"}>
        <Chapter key={currentChapter?.id} chapter={currentChapter} />;
      </AnimatePresence>
    </>
  );
}
