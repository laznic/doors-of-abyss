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
            <svg
              width="24"
              height="24"
              viewBox="0 0 15 15"
              fill="none"
              className="mx-auto text-muted mt-8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-muted" style={{ fontFamily: "PermanentMarker" }}>
              Draw something on the paper
            </p>
          </>
        );
      case "SHOW_PICTURE":
        return (
          <img src={DOMPurify.sanitize(notes?.[0]?.image)} alt="Action image" />
        );
      case "NOTEBOOK_READ":
        if (!Array.isArray(notes)) return null;

        const [firstColumn, secondColumn] = chunk(notes, 12);

        return (
          <>
            <div className="leading-8 absolute left-80 w-72 h-80 -skew-x-[28deg] -top-64 rotate-12 text-left overflow-hidden whitespace-normal">
              {firstColumn?.map((note) => (
                <p
                  key={note.id}
                  className="text-slate-900"
                  style={{ fontFamily: "PermanentMarker" }}
                >
                  {note.text}
                </p>
              ))}
            </div>
            <div className="leading-8 absolute left-[730px] w-64 h-96 -skew-x-[16deg] -top-48 rotate-12 text-left overflow-hidden whitespace-normal">
              {secondColumn?.map((note) => (
                <p
                  key={note.id}
                  className="text-slate-900"
                  style={{ fontFamily: "PermanentMarker" }}
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
              style={{ fontFamily: "PermanentMarker" }}
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
      { rx: [620, 610], ry: [350, 325], rotate: [-1, 1] },
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
      <header className="relative max-w-7xl mx-auto my-24">
        <div className="absolute top-[50%] -translate-y-1/2 left-0 right-0 mx-auto grid items-center text-center justify-center">
          {renderActions()}
        </div>

        <svg
          width="1280"
          height="720"
          version="1.1"
          className="mx-auto"
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
                cx="640"
                cy="360"
                fill="white"
                style={{ filter: "url(#displacementFilter)" }}
                initial={{ rx: 0, ry: 0, rotate: 1 }}
                animate={{ rx: 620, ry: 350, rotate: -1 }}
                exit={{ rx: 0, ry: 0, rotate: 1 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                onAnimationComplete={startAnimatingEllipse}
              />
            </mask>
          </defs>
          <image
            xlinkHref={DOMPurify.sanitize(chapter?.image)}
            width="1280"
            height="720"
            mask="url(#circleMask)"
          />
        </svg>
      </header>

      <section className="grid max-w-4xl mx-auto gap-4">
        <ChapterText key={chapter?.id} text={chapter?.text} />

        {!hasOptions && (
          <button className="inline-flex items-center text-sm gap-2 justify-self-end">
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
