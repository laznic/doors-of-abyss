import { useState, useEffect, useCallback } from "react";

export default function useKeyPress(
  targetKey: string,
  onPress: (event: KeyboardEvent) => void = () => null,
  target: Window | HTMLElement = window,
) {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey],
  );

  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
        onPress?.(event);
      }
    },
    [targetKey, onPress],
  );

  useEffect(() => {
    target?.addEventListener("keydown", downHandler);
    target?.addEventListener("keyup", upHandler);

    return () => {
      target?.removeEventListener("keydown", downHandler);
      target?.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler, target]);

  return keyPressed;
}
