import { useState, useEffect } from "react";

export default function useKeyPress(
  targetKey: string,
  onPress: (event: KeyboardEvent) => void = () => null,
  target: Window | HTMLElement = window,
) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(event: KeyboardEvent) {
    if (event.key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = (event: KeyboardEvent) => {
    if (event.key === targetKey) {
      setKeyPressed(false);
      onPress?.(event);
    }
  };

  useEffect(() => {
    target.addEventListener("keydown", downHandler);
    target.addEventListener("keyup", upHandler);

    return () => {
      target.removeEventListener("keydown", downHandler);
      target.removeEventListener("keyup", upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyPressed;
}
