import { Database } from "@/database.types";
import React, { useState } from "react";
import useKeyPress from "../hooks/useKeyPress";

interface ChapterOptionsProps {
  options: Database["public"]["Tables"]["options"]["Row"][];
  onOptionSelect: (id: number) => void;
}

export default function ChapterOptions({
  options,
  onOptionSelect,
}: ChapterOptionsProps) {
  const [activeOption, setActiveOption] = useState<number>(0);

  useKeyPress("ArrowUp", (e) => {
    e.preventDefault();
    setActiveOption((prev) => (prev - 1 < 0 ? options.length - 1 : prev - 1));
  });

  useKeyPress("ArrowDown", (e) => {
    e.preventDefault();
    setActiveOption((prev) => (prev + 1 > options.length - 1 ? 0 : prev + 1));
  });

  useKeyPress("Enter", (e) => {
    e.preventDefault();
    onOptionSelect(options[activeOption].id);
  });

  return (
    <section className="px-8">
      <ul>
        {options.map((option, index) => {
          const isActive = activeOption === index;

          return (
            <li key={option.id}>
              <button
                onClick={() => onOptionSelect(option.id)}
                className={`flex items-center ${
                  isActive ? "text-white" : "text-neutral-500"
                }`}
              >
                {isActive && (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 11L6 4L10.5 7.5L6 11Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}

                {option.text}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
