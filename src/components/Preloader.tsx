"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  isLoading: boolean;
  progress: number;
}

export default function Preloader({ isLoading, progress }: PreloaderProps) {
  const rounded = Math.round(progress);
  const formattedCount = rounded.toString().padStart(3, "0");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#050505] text-white p-8 md:p-14 select-none cursor-wait"
        >
          {/* Top bar: Quiet, architectural identity header */}
          <div className="flex items-center justify-between w-full text-[11px] uppercase tracking-[0.28em] text-white/40 font-mono">
            <div className="flex items-center gap-3">
              <span>Manarat Robotics Club</span>
              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-[#00d6ff] tracking-normal lowercase">v0.2</span>
            </div>
            <span className="hidden sm:inline text-white/20">Engineering &amp; Design</span>
          </div>

          {/* Center: Pure editorial typography - restrained, confident, un-gimmicky */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white/90">
              Manarat Robotics
            </h1>
            <p className="mt-2 text-xs md:text-sm tracking-[0.35em] uppercase text-white/30 font-medium">
              MRC
            </p>
          </div>

          {/* Bottom bar: Clean minimal counter & razor line progress */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-baseline justify-between w-full">
              <span className="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase">
                Preparing Experience
              </span>
              <span className="text-xs font-mono tabular-nums tracking-wider text-white/60">
                {formattedCount} <span className="text-white/25">/ 100</span>
              </span>
            </div>

            {/* Hairline progress rule */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-white/70"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ ease: "easeOut", duration: 0.15 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
