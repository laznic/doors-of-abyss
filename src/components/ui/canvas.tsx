import { debounce } from "@/lib/utils";
import React, { forwardRef, useCallback, useEffect, useState } from "react";

export default forwardRef(function Canvas(props, canvasRef) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;

    canvas?.setAttribute("width", `${window.innerWidth / 2.5}px`);
    canvas?.setAttribute("height", `${window.innerWidth / 5}px`);
  }, [canvasRef]);

  useEffect(() => {
    setCanvasSize();

    window.addEventListener("resize", debounce(setCanvasSize));

    return () => {
      window.removeEventListener("resize", debounce(setCanvasSize));
    };
  }, [canvasRef, setCanvasSize]);

  const startDrawing = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    setIsDrawing(true);

    const { clientX, clientY } = event as TouchEvent;
    const { left, top } = canvas?.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    setLastPoint({ x, y });
  };

  const drawLine = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing) {
      return;
    }

    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);

    const { clientX, clientY } = event as TouchEvent;
    const { left, top } = canvas.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    context.lineTo(x, y);
    context.strokeStyle = "#191f2f";
    context.lineWidth = 7.25;
    context.lineCap = "round";
    context.stroke();
    context.closePath();

    setLastPoint({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={"100%"}
      onMouseDown={startDrawing}
      onMouseMove={drawLine}
      onMouseUp={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={drawLine}
      onTouchEnd={stopDrawing}
    />
  );
});
