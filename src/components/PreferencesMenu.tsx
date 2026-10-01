"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface PreferencesMenuProps {
  smoothScroll: boolean;
  onToggleSmoothScroll: () => void;
  scrollIntensity: "ultra" | "balanced" | "snappy";
  onChangeIntensity: (intensity: "ultra" | "balanced" | "snappy") => void;
}

export default function PreferencesMenu({
  smoothScroll,
  onToggleSmoothScroll,
  scrollIntensity,
  onChangeIntensity,
}: PreferencesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-72 rounded-2xl border border-white/10 bg-[#0A0A0C]/95 p-4 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                Motion Dynamics
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] shadow-[0_0_8px_#00D6FF]" />
            </div>

            {/* Toggles list */}
            <div className="pt-3 space-y-3">
              <button
                type="button"
                onClick={onToggleSmoothScroll}
                className="w-full flex items-center justify-between py-1 text-left group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    Flowy Smooth Scroll
                  </span>
                  <span className="text-[10px] text-white/40">
                    Lenis inertia physics
                  </span>
                </div>

                {/* Apple-style pill switch */}
                <div
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                    smoothScroll
                      ? "bg-gradient-to-r from-[#0050FF] to-[#00D6FF]"
                      : "bg-white/15"
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: smoothScroll ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Intensity Presets (Visible when smoothScroll is active) */}
              {smoothScroll && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2">
                    Scroll Momentum
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => onChangeIntensity("ultra")}
                      className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                        scrollIntensity === "ultra"
                          ? "bg-[#00D6FF] text-black font-bold shadow-[0_0_12px_rgba(0,214,255,0.4)]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Ultra Flow
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeIntensity("balanced")}
                      className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                        scrollIntensity === "balanced"
                          ? "bg-[#00D6FF] text-black font-bold shadow-[0_0_12px_rgba(0,214,255,0.4)]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Balanced
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeIntensity("snappy")}
                      className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                        scrollIntensity === "snappy"
                          ? "bg-[#00D6FF] text-black font-bold shadow-[0_0_12px_rgba(0,214,255,0.4)]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Snappy
                    </button>
                  </div>
                  <span className="text-[9px] text-white/30 block mt-1.5 font-mono">
                    {scrollIntensity === "ultra" && "⚡ High travel (2.2x) & long silky glide"}
                    {scrollIntensity === "balanced" && "⚖ Standard continuous smooth inertia"}
                    {scrollIntensity === "snappy" && "🎯 Fast, direct response with light taper"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Preferences Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/70 hover:text-white hover:border-white/25 hover:bg-black/80 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95"
      >
        {/* Subtle sliders icon */}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-90 text-[#00D6FF]" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 4h4m4 0h4M6 2v4M2 12h8m4 0h0M10 10v4" />
        </svg>
        <span className="text-[11px] font-mono uppercase tracking-wider">
          Preferences
        </span>
      </button>
    </div>
  );
}
