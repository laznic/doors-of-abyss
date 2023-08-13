import { Logotype } from "@/components/ui/logo";
import SoundToggle from "@/modules/sounds/components/SoundToggle";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";
import Intro from "./Intro";

export default function Chapters() {
  const { currentChapter, inIntro } = useChapterContext();

  return (
    <>
      <div className="absolute right-4 top-4">
        <SoundToggle />
      </div>

      <AnimatePresence mode={"wait"}>
        {!inIntro && (
          <div className="absolute left-6 top-6">
            <Logotype className="w-48" />
          </div>
        )}

        {inIntro ? (
          <Intro key={"intro"} />
        ) : (
          <Chapter key={currentChapter?.id} chapter={currentChapter} />
        )}
      </AnimatePresence>
    </>
  );
}
