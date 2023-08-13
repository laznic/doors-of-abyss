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
  const [loading, setLoading] = useState(false);

  function onOptionSelect(id: number) {
    if (loading) return;

    setLoading(true);
    goToNextChapter?.(id, true);
  }

  async function handleContinue() {
    if (loading) return;
    if (options.length > 0) return;

    setLoading(true);

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
            className="w-[50dvw] mx-auto h-auto -mt-[15dvw]"
            src={DOMPurify.sanitize(notes?.[0]?.image)}
            alt="Action image"
          />
        );
      case "NOTEBOOK_READ":
        if (!Array.isArray(notes)) return null;

        const [firstColumn, secondColumn] = chunk(notes, 12);

        return (
          <>
            <div className="leading-[1.75dvw] absolute -top-[20dvw] left-[7dvw] w-[15dvw] h-[20dvw] -skew-x-[28deg] rotate-12 text-left overflow-hidden whitespace-normal">
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
            <div className="leading-[1.75dvw] absolute left-[30dvw] -top-[15dvw] w-[15dvw] h-[20dvw] -skew-x-[16deg] rotate-12 text-left overflow-hidden whitespace-normal">
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
    <section className="grid mx-auto h-full w-full">
      <header className="relative w-full mt-12">
        <div className="absolute w-1/2 top-[50%] -translate-y-1/2 left-0 right-0 mx-auto grid items-center text-center justify-center">
          {renderActions()}
        </div>

        <svg
          version="1.1"
          className="mx-auto aspect-video h-[40dvw] min-h-[240px]"
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

      <section className="flex w-[70%] left-0 right-0 mx-auto gap-12 absolute bg-black/75 justify-center bottom-12 pt-12 p-8 h-[12dvw]">
        {chapter?.text && <ChapterText key={chapter?.id} text={chapter.text} />}
        <div className="w-1/3">
          {!hasOptions && !loading && (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 11L6 4L10.5 7.5L6 11Z" fill="currentColor"></path>
              </svg>
              Continue
            </button>
          )}

          {loading && (
            <svg
              className="animate-spin z-10 mt-1"
              width="24"
              height="24"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}

          {hasOptions && !loading && (
            <ChapterOptions options={options} onOptionSelect={onOptionSelect} />
          )}
        </div>
      </section>
    </section>
  );
}
