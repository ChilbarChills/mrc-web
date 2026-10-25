"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  progress: MotionValue<number>;
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const TOTAL_FRAMES = 240;

function CanvasSequence({
  progress,
  onLoadProgress,
  onLoaded,
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [, setLoadedCount] = useState(0);
  const currentRenderFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Render with sub-frame alpha crossfade between consecutive frames
  const renderFrameToCanvas = useCallback((frameFloat: number) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(frameFloat, TOTAL_FRAMES - 1));
    const baseIndex = Math.floor(clamped);
    const nextIndex = Math.min(baseIndex + 1, TOTAL_FRAMES - 1);
    const fraction = clamped - baseIndex;

    const baseImg = imagesRef.current[baseIndex];
    if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = baseImg.width / baseImg.height;
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

    // Draw base frame with 100% opacity
    ctx.globalAlpha = 1.0;
    ctx.drawImage(baseImg, offsetX, offsetY, drawWidth, drawHeight);

    // Crossfade: if there's a sub-frame fraction and the next image is available, blend it on top
    if (fraction > 0.005 && nextIndex !== baseIndex) {
      const nextImg = imagesRef.current[nextIndex];
      if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
        ctx.globalAlpha = fraction;
        ctx.drawImage(nextImg, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0;
      }
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

  // Smooth continuous requestAnimationFrame loop for continuous sub-frame rendering
  useEffect(() => {
    const updateLoop = () => {
      const target = targetFrameRef.current;
      const current = currentRenderFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0005) {
        // Continuous float interpolation (eased lerp)
        const next = Math.abs(diff) < 0.005 ? target : current + diff * 0.45;
        currentRenderFrameRef.current = next;
        renderFrameToCanvas(next);
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

  // Listen to smooth scroll updates directly from Lenis for sub-pixel 110+ FPS fluid updates
  useEffect(() => {
    let unsubscribeLenis: (() => void) | null = null;

    const setupLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.on === "function") {
        const handler = () => {
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
          const floatFrame = Math.max(0, Math.min(progressVal * (TOTAL_FRAMES - 1), TOTAL_FRAMES - 1));
          targetFrameRef.current = floatFrame;
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
  }, [progress]);

  // Maintain MotionValue listener as fallback
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      const floatFrame = Math.max(0, Math.min(latest * (TOTAL_FRAMES - 1), TOTAL_FRAMES - 1));
      targetFrameRef.current = floatFrame;
    });

    return () => unsubscribe();
  }, [progress]);

  // Handle resize and ensuring current frame is redrawn correctly
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentProgress = progress.get();
        const floatFrame = Math.max(0, Math.min(currentProgress * (TOTAL_FRAMES - 1), TOTAL_FRAMES - 1));
        currentRenderFrameRef.current = floatFrame;
        targetFrameRef.current = floatFrame;
        renderFrameToCanvas(floatFrame);
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

export default memo(CanvasSequence);
