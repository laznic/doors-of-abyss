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
    <section>
      <ul>
        {options.map((option, index) => (
          <li key={option.id}>
            {option.text} {`is active: ${activeOption === index}`}
          </li>
        ))}
      </ul>
    </section>
  );
}
