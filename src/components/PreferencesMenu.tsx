"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface PreferencesMenuProps {
  smoothScroll: boolean;
  onToggleSmoothScroll: () => void;
}

export default function PreferencesMenu({
  smoothScroll,
  onToggleSmoothScroll,
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
            className="mb-3 w-64 rounded-2xl border border-white/10 bg-[#0A0A0C]/90 p-4 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                Preferences
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]" />
            </div>

            {/* Toggles list */}
            <div className="pt-3">
              <button
                type="button"
                onClick={onToggleSmoothScroll}
                className="w-full flex items-center justify-between py-2 px-1 text-left group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">
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
