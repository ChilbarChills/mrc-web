"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lagging spring physics for the outer cybernetic reticle
  const springConfig = { damping: 24, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Dynamic hover detector for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cyber-card, .clickable, label'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Outer Cybernetic Trailing Reticle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: isClicked ? 24 : isHovered ? 48 : 32,
          height: isClicked ? 24 : isHovered ? 48 : 32,
          borderColor: isHovered
            ? "rgba(0, 214, 255, 0.75)"
            : "rgba(134, 168, 207, 0.45)",
          backgroundColor: isHovered
            ? "rgba(0, 214, 255, 0.06)"
            : "rgba(0, 80, 255, 0.02)",
          scale: isClicked ? 0.85 : 1,
          boxShadow: isHovered
            ? "0 0 15px rgba(0, 214, 255, 0.35)"
            : "0 0 0px transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
      >
        {/* Futuristic Crosshair notches when hovering interactive targets */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute top-0 w-1 h-1 bg-[#00d6ff] rounded-full" />
            <div className="absolute bottom-0 w-1 h-1 bg-[#00d6ff] rounded-full" />
            <div className="absolute left-0 w-1 h-1 bg-[#C38EB4] rounded-full" />
            <div className="absolute right-0 w-1 h-1 bg-[#C38EB4] rounded-full" />
          </motion.div>
        )}
      </motion.div>

      {/* Center Laser Target Dot (Instant 1:1 response) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isClicked ? 1.6 : isHovered ? 1.3 : 1,
          backgroundColor: isHovered ? "#00d6ff" : "#ffffff",
          boxShadow: isHovered
            ? "0 0 8px #00d6ff, 0 0 12px rgba(0, 214, 255, 0.6)"
            : "0 0 4px rgba(255, 255, 255, 0.8)",
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
