import { Logotype } from "@/components/ui/logo";
import SoundToggle from "@/modules/sounds/components/SoundToggle";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";
import Intro from "./Intro";

export default function Chapters() {
  const { currentChapter, inIntro } = useChapterContext();

  return (
    <>
      {!inIntro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute left-6 top-6"
        >
          <Logotype className="w-48" />
        </motion.div>
      )}

      <div className="absolute right-4 top-4">
        <SoundToggle />
      </div>

      <AnimatePresence mode={"wait"}>
        {inIntro ? (
          <Intro key={"intro"} />
        ) : (
          <Chapter key={currentChapter?.id} chapter={currentChapter} />
        )}
      </AnimatePresence>
    </>
  );
}
