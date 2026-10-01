"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import CanvasSequence from "./CanvasSequence";
import Link from "next/link";
import {
  ChevronDown,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  ArrowRight,
  Compass,
  Radio,
} from "lucide-react";

interface ScrollytellingProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const STAGES = [
  { id: 0, label: "00 // INTRO", name: "Overview", progressTarget: 0.05 },
  { id: 1, label: "01 // ARCHITECTURE", name: "Custom PCB", progressTarget: 0.28 },
  { id: 2, label: "02 // SENSORS", name: "IR Array", progressTarget: 0.50 },
  { id: 3, label: "03 // PROPULSION", name: "Coreless Motors", progressTarget: 0.72 },
  { id: 4, label: "04 // REASSEMBLY", name: "Finale", progressTarget: 0.94 },
];

export default function Scrollytelling({
  onLoadProgress,
  onLoaded,
}: ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Track scroll within the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate stage from scroll progress cleanly
  const calculateStage = useCallback((progress: number) => {
    if (progress < 0.18) return 0;
    if (progress < 0.40) return 1;
    if (progress < 0.62) return 2;
    if (progress < 0.84) return 3;
    return 4;
  }, []);

  // Update stage only when boundary is crossed (avoids excessive re-renders)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextStage = calculateStage(latest);
    setCurrentStage((prev) => (prev !== nextStage ? nextStage : prev));
    setScrollPercent(Math.round(latest * 100));
  });

  // Handle initial hydration / reload at non-zero scroll position
  useEffect(() => {
    const initialProgress = scrollYProgress.get();
    setCurrentStage(calculateStage(initialProgress));
    setScrollPercent(Math.round(initialProgress * 100));
  }, [scrollYProgress, calculateStage]);

  // Smooth jump to specific stage
  const scrollToStage = (stageIndex: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const totalScrollableDistance = container.offsetHeight - window.innerHeight;
    const target = STAGES[stageIndex].progressTarget;
    const destination = containerTop + target * totalScrollableDistance;

    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(destination, { lerp: 0.06 });
    } else {
      window.scrollTo({
        top: destination,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#050508]">
      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        {/* Subtle Background Gradients & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d1527] via-[#050508] to-[#050508] opacity-80 z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00d6ff]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#0050ff]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* 3D Canvas Frame Sequence */}
        <div className="absolute inset-0 z-0">
          <CanvasSequence
            progress={scrollYProgress}
            onLoadProgress={onLoadProgress}
            onLoaded={onLoaded}
          />
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 z-5 pointer-events-none cyber-grid opacity-30" />

        {/* --- Top Telemetry HUD Overlay --- */}
        <div className="absolute top-20 left-0 right-0 z-20 pointer-events-none px-6 max-w-7xl mx-auto flex items-center justify-between">
          {/* Live CAD Sequence Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl text-[10px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <Radio className="w-3 h-3 text-[#00d6ff] animate-pulse" />
            <span className="text-white/80 font-bold">LFR-MK4 // CAD SEQUENCE</span>
            <span className="text-white/20">|</span>
            <span className="text-[#00d6ff]">FRAME FEED ONLINE</span>
          </div>

          {/* Interactive Stage Jump HUD */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToStage(s.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-200 ${
                  currentStage === s.id
                    ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.6)]"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
                title={`Jump to ${s.name}`}
              >
                <span className="sm:hidden">{s.id}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- Single Active Story Stage (Guaranteed Zero Text Overlap) --- */}
        <div className="absolute inset-0 z-10 pointer-events-none max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {/* STAGE 0: Hero / Club Introduction */}
            {currentStage === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#00d6ff] animate-pulse" />
                  <span className="cyber-badge text-[#00d6ff]">MRC://AUTONOMOUS_SYSTEMS</span>
                  <span className="text-white/20 text-xs">|</span>
                  <span className="text-xs font-mono text-white/50 tracking-wider">MANARAT ROBOTICS</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-6 uppercase">
                  <span className="block bg-gradient-to-r from-[#00d6ff] via-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent cyber-glow-cyan">
                    MRC
                  </span>
                  <span className="block text-white">
                    BEYOND LIMITS.
                  </span>
                </h1>

                <p className="text-base sm:text-xl text-white/70 max-w-2xl leading-relaxed mb-8 font-light">
                  ...Where lines meet algorithms. The official collegiate robotics society of{" "}
                  <span className="text-white font-medium">Manarat Dhaka International College</span>.
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-[0.25em] animate-bounce">
                  <span>Scroll to deconstruct</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#00d6ff]" />
                </div>
              </motion.div>
            )}

            {/* STAGE 1: Engineering Reveal & Telemetry (Left aligned HUD card) */}
            {currentStage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 max-w-lg pointer-events-auto"
              >
                <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#00d6ff]" />
                      <span className="cyber-badge text-[#00d6ff]">STAGE 01 // ARCHITECTURE</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">SYS_CLOCK: 84MHz</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 uppercase">
                    Built by students.<br />
                    <span className="bg-gradient-to-r from-[#00d6ff] to-white bg-clip-text text-transparent">
                      Forged in Code.
                    </span>
                  </h2>

                  <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4">
                    Every trace on the custom PCB has a deliberate purpose. From microsecond line detection to high-frequency PWM motor response, hardware and algorithms converge into a singular competition machine.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                    <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-white/40 block text-[10px]">CONTROLLER</span>
                      <span className="text-[#00d6ff] font-semibold">ARM Cortex-M4</span>
                    </div>
                    <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-white/40 block text-[10px]">LOOP LATENCY</span>
                      <span className="text-[#00d6ff] font-semibold">&lt; 0.5 ms</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: Precision Intelligence (Right aligned HUD card) */}
            {currentStage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 max-w-lg pointer-events-auto"
              >
                <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00d6ff]" />
                      <span className="cyber-badge text-[#00d6ff]">STAGE 02 // SENSOR ARRAY</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">● LIVE_FEED</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 uppercase">
                    Precision Meets <span className="text-[#00d6ff]">Intelligence.</span>
                  </h2>

                  <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4">
                    A 16-channel infrared reflectance array samples the track at 2,000 Hz, feeding predictive PID calculations that anticipate hairpin turns before the chassis even shifts.
                  </p>

                  <ul className="space-y-2.5 text-xs md:text-sm text-white/80">
                    <li className="flex items-center gap-2.5 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-[#00d6ff] shrink-0" />
                      <span>Sub-millimeter optical line positioning</span>
                    </li>
                    <li className="flex items-center gap-2.5 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                      <Zap className="w-4 h-4 text-[#00d6ff] shrink-0" />
                      <span>Dynamic differential motor torque correction</span>
                    </li>
                    <li className="flex items-center gap-2.5 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                      <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero-delay real-time telemetry output</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Performance & Propulsion (Left aligned HUD card) */}
            {currentStage === 3 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 max-w-lg pointer-events-auto"
              >
                <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00d6ff]" />
                      <span className="cyber-badge text-[#00d6ff]">STAGE 03 // PROPULSION</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">PWM: 100% BURST</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 uppercase">
                    High-Torque.<br />
                    <span className="text-[#00d6ff]">Zero Compromise.</span>
                  </h2>

                  <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4">
                    Coreless motors spinning at 25,000 RPM linked to CNC brass micro-pinions deliver explosive acceleration up to 3.4 m/s while aerodynamic vacuum fans generate ground downforce.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[10px] text-white/40 block">TOP SPEED</span>
                      <span className="text-base font-bold text-white">3.4 m/s</span>
                    </div>
                    <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[10px] text-white/40 block">MOTOR RPM</span>
                      <span className="text-base font-bold text-[#00d6ff]">25,000</span>
                    </div>
                    <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[10px] text-white/40 block">CHASSIS</span>
                      <span className="text-base font-bold text-[#00d6ff]">Carbon 3K</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: Finale & Portal Gateway (Centered) */}
            {currentStage === 4 && (
              <motion.div
                key="stage-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="cyber-badge text-white/80">REASSEMBLY COMPLETE</span>
                </div>

                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-5 uppercase">
                  BUILD WHAT<br />
                  <span className="bg-gradient-to-r from-[#00d6ff] via-[#60a5fa] to-white bg-clip-text text-transparent">
                    COMES NEXT.
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 font-light">
                  Manarat Robotics Club is more than a team — it is an engineering workshop where your code takes physical form.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="#events"
                    className="px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-black bg-[#00d6ff] hover:bg-[#38e1ff] transition-all shadow-[0_0_25px_rgba(0,214,255,0.4)] flex items-center gap-2"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#recruitment"
                    className="px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-white bg-white/5 border border-white/15 hover:border-[#00d6ff]/50 hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(0,214,255,0.15)] flex items-center gap-2"
                  >
                    <span>Recruitment (Opening Soon)</span>
                  </a>

                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-[#00d6ff] bg-[#00d6ff]/10 border border-[#00d6ff]/30 hover:bg-[#00d6ff]/20 transition-all flex items-center gap-2"
                  >
                    <span>Portal Login</span>
                  </Link>
                </div>

                <div className="mt-12 text-white/30 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 animate-bounce text-[#00d6ff]" />
                  <span>Scroll down for club tracks, projects &amp; records</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Bottom Status Bar --- */}
        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span>STAGE: 0{currentStage} / 04</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">EXPLODED VIEW PROGRESS:</span>
            <span className="text-[#00d6ff] font-semibold">{scrollPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
