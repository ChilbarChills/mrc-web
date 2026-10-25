"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  progress: MotionValue<number>;
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const TOTAL_FRAMES = 240;

export default function CanvasSequence({
  progress,
  onLoadProgress,
  onLoaded,
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [, setLoadedCount] = useState(0);
  const lastDrawnFrameRef = useRef(-1);
  const currentRenderFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const renderFrameToCanvas = useCallback((frameIndex: number) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    if (lastDrawnFrameRef.current === frameIndex) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      lastDrawnFrameRef.current = frameIndex;
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, []);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;
    imagesRef.current = loadedImages;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;

      const handleImageLoad = () => {
        loaded++;
        setLoadedCount(loaded);

        // Immediately paint the first frame as soon as it arrives!
        if (i === 1) {
          lastDrawnFrameRef.current = -1;
          renderFrameToCanvas(0);
        }

        const percent = (loaded / TOTAL_FRAMES) * 100;
        if (onLoadProgress) {
          onLoadProgress(percent);
        }
        if (loaded === TOTAL_FRAMES && onLoaded) {
          onLoaded();
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad;
      loadedImages.push(img);
    }
  }, [renderFrameToCanvas, onLoadProgress, onLoaded]);

  // Smooth continuous requestAnimationFrame loop to eliminate frame-stutter and tail-end stepping
  useEffect(() => {
    const updateLoop = () => {
      // Calculate target integer frame from scroll progress
      const target = targetFrameRef.current;
      const current = currentRenderFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        // Smoothly interpolate current frame toward target (lerp factor: 0.25)
        const next = Math.abs(diff) < 0.2 ? target : current + diff * 0.25;
        currentRenderFrameRef.current = next;
        const intFrame = Math.max(0, Math.min(Math.round(next), TOTAL_FRAMES - 1));
        renderFrameToCanvas(intFrame);
      }

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrameToCanvas]);

  // Listen to motion value updates and store target frame
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      let frame = Math.round(latest * (TOTAL_FRAMES - 1));
      frame = Math.max(0, Math.min(frame, TOTAL_FRAMES - 1));
      targetFrameRef.current = frame;
    });

    return () => unsubscribe();
  }, [progress]);

  // Handle resize and ensuring the current or first frame is always drawn
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        let frameIndex = Math.round(progress.get() * (TOTAL_FRAMES - 1));
        frameIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
        lastDrawnFrameRef.current = -1; // Reset to force redraw on canvas resize
        renderFrameToCanvas(frameIndex);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [renderFrameToCanvas, progress]);

  return (
    <div className="w-full h-full relative bg-[#070E1A]">
      <canvas ref={canvasRef} className="block w-full h-full object-cover" />
    </div>
  );
}
