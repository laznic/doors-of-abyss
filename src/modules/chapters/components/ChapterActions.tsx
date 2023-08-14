import Canvas from "@/components/ui/canvas";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import DOMPurify from "dompurify";
import { chunk } from "remeda";
import { getRandomFromArray } from "@/lib/utils";
import { ChapterContextType } from "../context/ChapterContext";

interface ChapterActionsProps {
  chapter: ChapterContextType["currentChapter"];
  canvasRef?: React.MutableRefObject<HTMLCanvasElement>;
  textAreaRef?: React.MutableRefObject<HTMLTextAreaElement>;
}

export default function ChapterActions({
  chapter,
  canvasRef,
  textAreaRef,
}: ChapterActionsProps) {
  const [action] = chapter?.actions || [];
  const notes = chapter?.notes || [];

  function renderActions() {
    switch (action?.action_type) {
      case "DRAW":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Canvas ref={canvasRef} />
            <p
              className="text-muted -mb-20"
              style={{ fontFamily: "PermanentMarker" }}
            >
              Draw something on the paper
            </p>
          </motion.div>
        );
      case "SHOW_PICTURE":
        return (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[50dvw] mx-auto h-auto"
            src={DOMPurify.sanitize(notes?.[0]?.image)}
            alt="Action image"
          />
        );
      case "NOTEBOOK_READ":
        if (!Array.isArray(notes)) return null;

        const [firstColumn, secondColumn] = chunk(notes, 12);

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="top-0 w-full h-full absolute"
          >
            <div className="leading-[1.75dvw] top-[5dvw] absolute left-[7dvw] w-[15dvw] h-[20dvw] -skew-x-[28deg] rotate-12 text-left overflow-hidden whitespace-normal">
              {firstColumn?.map((note) => (
                <p
                  key={note.id}
                  className="text-slate-900 text-[1.75dvw]"
                  style={{
                    fontFamily: getRandomFromArray([
                      "Caveat",
                      "PermanentMarker",
                      "Version01",
                      "Version03",
                    ]),
                  }}
                >
                  {note.text}
                </p>
              ))}
            </div>
            <div className="leading-[1.75dvw] absolute left-[30dvw] top-[9dvw] w-[15dvw] h-[20dvw] -skew-x-[16deg] rotate-12 text-left overflow-hidden whitespace-normal">
              {secondColumn?.map((note) => (
                <p
                  key={note.id}
                  className="text-slate-900"
                  style={{
                    fontFamily: getRandomFromArray([
                      "Caveat",
                      "PermanentMarker",
                      "Version01",
                      "Version03",
                    ]),
                  }}
                >
                  {note.text}
                </p>
              ))}
            </div>
          </motion.div>
        );
      case "NOTEBOOK_WRITE":
        return (
          <motion.div className="leading-8 absolute left-80 w-72 h-80 -skew-x-[28deg] -top-64 rotate-12 text-left overflow-hidden whitespace-normal">
            <textarea
              ref={textAreaRef}
              rows={10}
              maxLength={40}
              style={{
                fontFamily: getRandomFromArray([
                  "Caveat",
                  "PermanentMarker",
                  "Version01",
                  "Version03",
                ]),
              }}
              className="bg-transparent resize-none text-slate-900 placeholder-slate-800 outline-none"
              placeholder="Type something"
            />
          </motion.div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="absolute w-1/2 h-[40dvw] min-h-[240px] top-0 left-0 right-0 mx-auto grid items-center text-center justify-center">
      {renderActions()}
    </div>
  );
}
