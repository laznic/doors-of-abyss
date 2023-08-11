import Canvas from "@/components/ui/canvas";
import React, { useEffect, useRef, useState } from "react";
import {
  ChapterContextType,
  useChapterContext,
} from "../context/ChapterContext";
import DOMPurify from "dompurify";
import ChapterOptions from "../components/ChapterOptions";
import useKeyPress from "../hooks/useKeyPress";
import { animate, motion, usePresence } from "framer-motion";
import ChapterText from "../components/ChapterText";
import supabase from "@/lib/supabase";
import { chunk } from "remeda";
import { getRandomFromArray } from "@/lib/utils";

interface ChapterProps {
  chapter: ChapterContextType["currentChapter"];
}

export default function Chapter({ chapter }: ChapterProps) {
  const { goToNextChapter } = useChapterContext();
  const [action] = chapter?.actions || [];
  const options = chapter?.options || [];
  const notes = chapter?.notes || [];
  const canvasRef = useRef<HTMLCanvasElement>();
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const hasOptions = options.length > 0;
  const [ellipsisAnimation, setEllipsisAnimation] = useState();
  const [isPresent, safeToRemove] = usePresence();

  function onOptionSelect(id: number) {
    goToNextChapter?.(id, true);
  }

  async function handleContinue() {
    if (options.length > 0) return;

    if (action?.action_type === "DRAW") {
      canvasRef.current?.toBlob(async function (blob) {
        const { data: uploadedImage, error: uploadError } =
          await supabase.storage
            .from("chapters")
            .upload(`${Date.now()}.png`, blob, {
              contentType: "image/png",
            });

        if (uploadError) return console.error(uploadError);

        const path = `${
          import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/chapters/${uploadedImage?.path}`;

        const { error: noteError } = await supabase.from("notes").insert({
          image: path,
        });

        if (noteError) return console.error(noteError);
      });
    }

    if (action?.action_type === "NOTEBOOK_WRITE") {
      const { error: noteError } = await supabase
        .from("notes")
        .insert({
          text: textAreaRef.current?.value,
        })
        .single();

      if (noteError) return console.error(noteError);
    }

    goToNextChapter?.(action?.id);
  }

  function renderActions() {
    switch (action?.action_type) {
      case "DRAW":
        return (
          <>
            <Canvas ref={canvasRef} />
            <p
              className="text-muted -mb-20"
              style={{ fontFamily: "PermanentMarker" }}
            >
              Draw something on the paper
            </p>
          </>
        );
      case "SHOW_PICTURE":
        return (
          <img
            className="w-[67dvw] mx-auto h-auto"
            src={DOMPurify.sanitize(notes?.[0]?.image)}
            alt="Action image"
          />
        );
      case "NOTEBOOK_READ":
        if (!Array.isArray(notes)) return null;

        const [firstColumn, secondColumn] = chunk(notes, 12);

        return (
          <>
            <div className="leading-[1.75dvw] absolute -top-[13dvw] left-0 w-[14dvw] h-[17dvw] -skew-x-[28deg] rotate-12 text-left overflow-hidden whitespace-normal">
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
            <div className="leading-[1.75dvw] absolute left-[18.5dvw] -top-[9dvw] w-[13dvw] h-[18dvw] -skew-x-[16deg] rotate-12 text-left overflow-hidden whitespace-normal">
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
          </>
        );
      case "NOTEBOOK_WRITE":
        return (
          <div className="leading-8 absolute left-80 w-72 h-80 -skew-x-[28deg] -top-64 rotate-12 text-left overflow-hidden whitespace-normal">
            <textarea
              ref={textAreaRef}
              rows={10}
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
          </div>
        );
      default:
        return null;
    }
  }

  useKeyPress("Enter", handleContinue);

  function startAnimatingEllipse() {
    const animation = animate(
      "ellipse",
      { rx: ["49%", "42%"], ry: ["47%", "45%"], rotate: [-1, 1] },
      {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    );

    setEllipsisAnimation(animation);
  }

  useEffect(() => {
    if (isPresent) {
      textAreaRef.current?.focus();
    }

    if (!isPresent) {
      ellipsisAnimation?.stop();
      safeToRemove();
    }
  }, [isPresent, ellipsisAnimation, safeToRemove]);

  return (
    <section className="grid mx-auto items-center justify-center h-full w-[85%] left-0 right-0">
      <header className="relative mx-auto my-24">
        <div className="absolute w-1/2 top-[50%] -translate-y-1/2 left-0 right-0 mx-auto grid items-center text-center justify-center">
          {renderActions()}
        </div>

        <svg
          version="1.1"
          className="mx-auto aspect-video h-[33dvw] min-h-[240px]"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <filter id="displacementFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="6"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="100"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="circleMask">
              <motion.ellipse
                cx="50%"
                cy="50%"
                fill="white"
                style={{ filter: "url(#displacementFilter)" }}
                initial={{ rx: 0, ry: 0, rotate: 1 }}
                animate={{ rx: "49%", ry: "47%", rotate: -1 }}
                exit={{ rx: 0, ry: 0, rotate: 1 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                onAnimationComplete={startAnimatingEllipse}
              />
            </mask>
          </defs>
          <image
            width="100%"
            xlinkHref={DOMPurify.sanitize(chapter?.image)}
            mask="url(#circleMask)"
          />
        </svg>
      </header>

      <section className="grid max-w-4xl mx-auto gap-4">
        <ChapterText key={chapter?.id} text={chapter?.text} />

        {!hasOptions && (
          <button
            onClick={handleContinue}
            className="inline-flex items-center text-sm gap-2 justify-self-end"
          >
            Continue
            <div className="relative -mt-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 15 15"
                fill="none"
                className="absolute top-[6px] -left-1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 4L9 11L4.5 7.5L9 4Z" fill="currentColor"></path>
              </svg>
              <svg
                width="22"
                height="22"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.12263 12H5.1H3.5C3.22386 12 3 11.7761 3 11.5C3 11.2239 3.22386 11 3.5 11H5.1C6.22836 11 7.04455 10.9996 7.68648 10.9472C8.32256 10.8952 8.74338 10.7946 9.08897 10.6185C9.74753 10.283 10.283 9.74753 10.6185 9.08897C10.7946 8.74338 10.8952 8.32256 10.9472 7.68648C10.9996 7.04455 11 6.22836 11 5.1V3.5C11 3.22386 11.2239 3 11.5 3C11.7761 3 12 3.22386 12 3.5V5.1V5.12263C12 6.22359 12 7.08052 11.9438 7.76791C11.8868 8.46584 11.7694 9.0329 11.5095 9.54296C11.0781 10.3897 10.3897 11.0781 9.54296 11.5095C9.0329 11.7694 8.46584 11.8868 7.76791 11.9438C7.08052 12 6.22359 12 5.12263 12Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        )}

        {hasOptions && (
          <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
        )}
      </section>
    </section>
  );
}
