"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

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
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;

      const handleImageLoad = () => {
        loaded++;
        setLoadedCount(loaded);
        const percent = (loaded / TOTAL_FRAMES) * 100;
        if (onLoadProgress) {
          onLoadProgress(percent);
        }
        if (loaded === TOTAL_FRAMES && onLoaded) {
          onLoaded();
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Don't block preloader forever if a single frame fails
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [onLoadProgress, onLoaded]);

  const drawFrame = (frameIndex: number) => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[frameIndex];
    if (img && img.complete) {
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
  };

  useMotionValueEvent(progress, "change", (latest) => {
    let frameIndex = Math.floor(latest * (TOTAL_FRAMES - 1));
    frameIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    requestAnimationFrame(() => drawFrame(frameIndex));
  });

  // Handle resize and initial draw
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        let frameIndex = Math.floor(progress.get() * (TOTAL_FRAMES - 1));
        frameIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
        drawFrame(frameIndex);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial sizing

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [images, loadedCount, progress]);

  return (
    <div className="w-full h-full relative bg-[#050505]">
      <canvas ref={canvasRef} className="block w-full h-full object-cover" />
    </div>
  );
}
