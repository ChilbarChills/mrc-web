"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  progress: MotionValue<number>;
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const TOTAL_FRAMES = 240;
// Velocity cutoff (px/frame) below which the animation cuts off and stops moving immediately,
// completely eliminating the lingering last-second crawl/choppiness.
const VELOCITY_STOP_THRESHOLD = 0.35;

function CanvasSequence({
  progress,
  onLoadProgress,
  onLoaded,
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [, setLoadedCount] = useState(0);
  const lastDrawnFrameRef = useRef(-1);

  // Draw discrete crisp frame directly to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;

    const clamped = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    if (lastDrawnFrameRef.current === clamped) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastDrawnFrameRef.current = clamped;

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

        // Immediately paint the first frame as soon as it arrives
        if (i === 1) {
          drawFrame(0);
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
  }, [drawFrame, onLoadProgress, onLoaded]);

  // Synchronize canvas directly with Lenis smooth scroll:
  // Cuts off and stops moving immediately once scroll velocity drops below threshold
  useEffect(() => {
    let unsubscribeLenis: (() => void) | null = null;

    const setupLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.on === "function") {
        const handler = (e: any) => {
          // Immediately stop updating once velocity drops below the cutoff threshold,
          // preventing the slow last-second drift/crawl.
          if (Math.abs(e.velocity) < VELOCITY_STOP_THRESHOLD) {
            return;
          }

          const canvasEl = canvasRef.current;
          const container = canvasEl?.closest("[data-scroll-container]") as HTMLElement | null;
          let progressVal = progress.get();
          if (container) {
            const rect = container.getBoundingClientRect();
            const totalScrollable = container.offsetHeight - window.innerHeight;
            if (totalScrollable > 0) {
              progressVal = Math.max(0, Math.min(-rect.top / totalScrollable, 1));
            }
          }

          const frameIndex = Math.round(progressVal * (TOTAL_FRAMES - 1));
          drawFrame(frameIndex);
        };

        lenis.on("scroll", handler);
        unsubscribeLenis = () => lenis.off("scroll", handler);
        return true;
      }
      return false;
    };

    if (!setupLenis()) {
      const timer = setTimeout(setupLenis, 200);
      return () => clearTimeout(timer);
    }

    return () => {
      if (unsubscribeLenis) unsubscribeLenis();
    };
  }, [drawFrame, progress]);

  // Fallback MotionValue listener when Lenis is not active
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      const lenis = (window as any).__lenis;
      if (!lenis || !lenis.isSmooth) {
        const frameIndex = Math.round(latest * (TOTAL_FRAMES - 1));
        drawFrame(frameIndex);
      }
    });

    return () => unsubscribe();
  }, [drawFrame, progress]);

  // Handle window resize and ensuring the correct frame remains painted
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        lastDrawnFrameRef.current = -1;
        const currentProgress = progress.get();
        const frameIndex = Math.round(currentProgress * (TOTAL_FRAMES - 1));
        drawFrame(frameIndex);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawFrame, progress]);

  return (
    <div className="w-full h-full relative bg-[#070E1A]">
      <canvas ref={canvasRef} className="block w-full h-full object-cover" />
    </div>
  );
}

export default memo(CanvasSequence);
