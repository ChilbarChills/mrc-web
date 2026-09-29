"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export default function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Smooth out thumb movement with subtle spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  // Temporarily reveal bar when scrolling, fade out after idle (Apple-style)
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 1400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`fixed right-2 top-0 bottom-0 z-40 w-1 pointer-events-none transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Track line (ultra faint hairline) */}
      <div className="absolute inset-y-6 right-0 w-[2px] bg-white/[0.04] rounded-full" />

      {/* Aesthetic glowing thumb */}
      <motion.div
        className="absolute right-0 w-[3px] rounded-full bg-gradient-to-b from-white/70 via-white/50 to-[#00D6FF]/60 shadow-[0_0_8px_rgba(0,214,255,0.4)]"
        style={{
          top: "24px",
          bottom: "24px",
          scaleY: smoothProgress,
          transformOrigin: "top",
        }}
      />
    </div>
  );
}
