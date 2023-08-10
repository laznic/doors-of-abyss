import React from "react";
import { useChapterContext } from "../context/ChapterContext";
import Chapter from "./Chapter";

export default function Chapters() {
  const { currentChapter } = useChapterContext();

  return <Chapter key={currentChapter?.id} chapter={currentChapter} />;
}
