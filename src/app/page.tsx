"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Scrollytelling from "@/components/Scrollytelling";
import Preloader from "@/components/Preloader";
import PreferencesMenu from "@/components/PreferencesMenu";
import CustomScrollbar from "@/components/CustomScrollbar";
import EventRegisterModal from "@/components/EventRegisterModal";
import Link from "next/link";
import { ClubEvent, RobotProject, Announcement, User } from "@/lib/types";
import {
  Zap,
  Cpu,
  Activity,
  Award,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Mail,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Flame,
  User as UserIcon,
} from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [smoothScroll, setSmoothScroll] = useState(true);
  const [scrollIntensity, setScrollIntensity] = useState<"ultra" | "balanced" | "snappy">("ultra");
  const lenisRef = useRef<Lenis | null>(null);

  // Data states
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [projects, setProjects] = useState<RobotProject[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedEventForModal, setSelectedEventForModal] = useState<ClubEvent | null>(null);

  // Waitlist form state
  const [waitlistData, setWaitlistData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "Computer Science & Engineering",
  });
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);

  // Initialize and synchronize Lenis smooth scroll with ultra-flow physics
  useEffect(() => {
    const currentLerp =
      scrollIntensity === "ultra" ? 0.05 : scrollIntensity === "balanced" ? 0.075 : 0.1;
    const currentMultiplier =
      scrollIntensity === "ultra" ? 2.2 : scrollIntensity === "balanced" ? 1.6 : 1.2;

    const lenis = new Lenis({
      wrapper: window,
      content: document.documentElement,
      eventsTarget: window,
      smoothWheel: smoothScroll,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.8,
      touchMultiplier: 1.8,
      wheelMultiplier: currentMultiplier,
      lerp: currentLerp,
      autoRaf: true,
      respectReducedMotion: false,
      overscroll: true,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, [smoothScroll, scrollIntensity]);

  const handleToggleSmoothScroll = useCallback(() => {
    setSmoothScroll((prev) => !prev);
  }, []);

  const handleChangeIntensity = useCallback((intensity: "ultra" | "balanced" | "snappy") => {
    setScrollIntensity(intensity);
  }, []);

  const handleLoadProgress = useCallback((progress: number) => {
    setLoadProgress(progress);
  }, []);

  const handleLoaded = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, annRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/announcements"),
        ]);
        const eventsJson = await eventsRes.json();
        const annJson = await annRes.json();

        if (eventsJson.success) setEvents(eventsJson.events);
        if (annJson.success) setAnnouncements(annJson.announcements);
      } catch (err) {
        console.error("Failed to fetch initial home data:", err);
      }
    }
    loadData();
  }, []);

  // Safety fallback for preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waitlistData),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlistSuccess(true);
      }
    } catch {
      alert("Submission error. Please try again.");
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  return (
    <>
      <Preloader isLoading={isLoading} progress={loadProgress} />

      <main
        className={`flex min-h-screen flex-col bg-[#050508] text-white transition-opacity duration-1000 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <CustomScrollbar />
        <Navbar />

        {/* 1. SCROLLYTELLING HERO SECTION (Fixed & Bug-Free) */}
        <Scrollytelling
          onLoadProgress={handleLoadProgress}
          onLoaded={handleLoaded}
        />

        {/* 2. LIVE CLUB TELEMETRY STATS BANNER */}
        <section className="relative z-20 border-y border-white/10 bg-[#08090e] py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 border-r border-white/5 last:border-r-0">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white block">
                  180<span className="text-[#00d6ff]">+</span>
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Active Members
                </span>
              </div>

              <div className="p-4 border-r border-white/5 last:border-r-0">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-[#00d6ff] block">
                  15<span className="text-white">+</span>
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Tournaments &amp; Events
                </span>
              </div>

              <div className="p-4 border-r border-white/5 last:border-r-0">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white block">
                  28
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Engineered Robots
                </span>
              </div>

              <div className="p-4">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-emerald-400 block">
                  98.4<span className="text-xs text-white/40">%</span>
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Autonomous Accuracy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE FOCUS TRACKS (CATEGORIES) */}
        <section id="tracks" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
              <Zap className="w-3.5 h-3.5 text-[#00d6ff]" />
              <span className="cyber-badge text-[#00d6ff]">CLUB PILLARS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
              Core Focus <span className="text-[#00d6ff]">Tracks</span>
            </h2>
            <p className="text-sm md:text-base text-white/60 max-w-xl mt-3">
              We engineer across competitive fields, embedded electronics, and autonomous intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Track 01 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">
                TRACK 01 // COMPETITIONS
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#0050ff]/20 border border-[#0050ff]/40 flex items-center justify-center text-[#00d6ff] mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,80,255,0.25)]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white mb-2">Line Following &amp; Combat</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                High-speed LFR bots with PID control, Robosoccer strikers with omni-directional wheels, and antweight combat robots.
              </p>
              <div className="text-[10px] font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1">
                <span>View Arena Builds</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Track 02 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">
                TRACK 02 // HARDWARE
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00d6ff]/15 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff] mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white mb-2">Circuitry &amp; Fabrication</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Custom double-sided PCB layout in KiCAD, discrete MOSFET motor drivers, SMD soldering, and 3D chassis design.
              </p>
              <div className="text-[10px] font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1">
                <span>Explore Lab Tools</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Track 03 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">
                TRACK 03 // INTELLIGENCE
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white mb-2">Embedded AI &amp; Firmware</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                STM32 Bare-metal C++, dual-core ESP32 wireless telemetry, ROS2 node communications, and optical flow positioning.
              </p>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <span>View Algorithms</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Track 04 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">
                TRACK 04 // COMMUNITY
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white mb-2">Workshops &amp; Mentorship</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Hands-on bootcamps for beginner students, code walkthroughs, national hackathon prep, and campus science fair exhibitions.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span>Explore Workshops</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. UPCOMING EVENTS & COMPETITIONS (DATABASE DRIVEN) */}
        <section id="events" className="relative z-20 py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
                <Calendar className="w-3.5 h-3.5 text-[#00d6ff]" />
                <span className="cyber-badge text-[#00d6ff]">FIELD SCHEDULE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
                Upcoming <span className="text-[#00d6ff]">Events</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 border-b border-white/20 pb-1"
            >
              <span>View All Events &amp; Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00d6ff]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="cyber-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-[#00d6ff]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded-md font-bold tracking-wider ${
                        event.category === "COMPETITION"
                          ? "bg-[#0050ff]/20 text-[#00d6ff] border border-[#0050ff]/40"
                          : "bg-[#00d6ff]/20 text-[#00d6ff] border border-[#00d6ff]/30"
                      }`}
                    >
                      {event.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {event.registeredCount}/{event.maxCapacity} SLOTS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00d6ff] transition-colors leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-white/60 mb-6 leading-relaxed">
                    {event.shortDesc}
                  </p>

                  <div className="space-y-2 text-xs font-mono text-white/50 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#00d6ff]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/30" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00d6ff]" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventForModal(event)}
                  className="w-full py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold bg-white/[0.05] border border-white/10 hover:bg-[#00d6ff] hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2"
                >
                  <span>Register Free Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURED ROBOT BUILDS GALLERY */}
        <section id="projects" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span className="cyber-badge text-purple-400">HARDWARE SHOWCASE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
                Featured <span className="text-[#00d6ff]">Robots</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 border-b border-white/20 pb-1"
            >
              <span>Explore Complete Spec Sheets</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00d6ff]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Robot 1 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                    CHAMPION LFR
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    ACTIVE COMP
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Apex-V3 Line Follower</h3>
                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  16x photodiode array with STM32 ARM Cortex-M4 running predictive PID algorithm at 2000Hz.
                </p>

                <div className="space-y-2 text-xs font-mono mb-6">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">TOP SPEED</span>
                    <span className="text-white font-semibold">3.4 m/s</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">MOTOR RPM</span>
                    <span className="text-[#00d6ff] font-semibold">25,000 RPM Coreless</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">MICROCONTROLLER</span>
                    <span className="text-[#00d6ff] font-semibold">STM32F401 BlackPill</span>
                  </div>
                </div>
              </div>
              <Link
                href="/projects"
                className="text-xs font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1.5 hover:underline"
              >
                <span>Read Full Engineering Log</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Robot 2 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                    ROBOSOCCER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    ACTIVE COMP
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Titan-9 RoboSoccer Bot</h3>
                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  Holonomic 3-wheel omni drive, 24V linear solenoid pulse kicker, and 360° IR ball tracking array.
                </p>

                <div className="space-y-2 text-xs font-mono mb-6">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">DRIVE TYPE</span>
                    <span className="text-white font-semibold">120° Omni-Drive</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">KICK MECHANISM</span>
                    <span className="text-[#00d6ff] font-semibold">1500N Solenoid Pulse</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">CONTROLLER</span>
                    <span className="text-[#00d6ff] font-semibold">ESP32-S3 Dual Core</span>
                  </div>
                </div>
              </div>
              <Link
                href="/projects"
                className="text-xs font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1.5 hover:underline"
              >
                <span>Read Full Engineering Log</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Robot 3 */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                    AUTONOMOUS UAV
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0050ff]/20 text-[#00d6ff] border border-[#00d6ff]/30">
                    IN DEV
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AeroScan Autonomous UAV</h3>
                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  GPS-denied indoor navigation quadcopter utilizing downward optical flow and laser ToF ground locking.
                </p>

                <div className="space-y-2 text-xs font-mono mb-6">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">AUTOPILOT</span>
                    <span className="text-white font-semibold">PX4 + MAVLink ROS2</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">SENSORS</span>
                    <span className="text-[#00d6ff] font-semibold">Optical Flow + LiDAR</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">FRAME</span>
                    <span className="text-[#00d6ff] font-semibold">250mm 3K Carbon Quad</span>
                  </div>
                </div>
              </div>
              <Link
                href="/projects"
                className="text-xs font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1.5 hover:underline"
              >
                <span>Read Full Engineering Log</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. RECRUITMENT SECTION — "WILL OPEN SOON" (USER REQUIREMENT) */}
        <section id="recruitment" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="cyber-card rounded-3xl p-8 md:p-14 border border-[#00d6ff]/25 relative overflow-hidden bg-gradient-to-br from-[#121420] via-[#090b10] to-[#07080c]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00d6ff]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/40 bg-[#00d6ff]/15 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00d6ff] animate-ping" />
                <span className="cyber-badge text-[#00d6ff]">STATUS: RECRUITMENT OPENS SOON</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 leading-tight">
                Join the <span className="text-[#00d6ff]">Robotics Society</span>.
              </h2>

              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8">
                Official intake applications for the upcoming academic season will <span className="text-white font-semibold">open soon</span>. Whether you are passionate about writing firmware, soldering custom micro-PCBs, building mechanical gearboxes, or organizing national tournaments, MRC is the place to build.
              </p>

              {waitlistSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold block">You're on the Priority Notification List!</span>
                    <span className="text-xs text-emerald-300/80">
                      We will notify your student email as soon as formal applications unlock.
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={waitlistData.name}
                      onChange={(e) => setWaitlistData({ ...waitlistData, name: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Student Email Address *"
                      value={waitlistData.email}
                      onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                    <input
                      type="text"
                      placeholder="Student ID (e.g. B26-CS-041)"
                      value={waitlistData.studentId}
                      onChange={(e) => setWaitlistData({ ...waitlistData, studentId: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                    <select
                      value={waitlistData.department}
                      onChange={(e) => setWaitlistData({ ...waitlistData, department: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-[#0e1017] border border-white/10 text-white focus:outline-none focus:border-[#00d6ff]"
                    >
                      <option value="Computer Science & Engineering">Dept: Computer Science</option>
                      <option value="Electrical & Electronic Engineering">Dept: Electrical Engineering</option>
                      <option value="Mechanical Engineering">Dept: Mechanical Engineering</option>
                      <option value="Science / High School">High School Science Division</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-[#00d6ff] hover:bg-[#38e1ff] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,214,255,0.3)] flex items-center justify-center gap-2"
                  >
                    <span>{waitlistSubmitting ? "Registering..." : "Notify Me When Applications Open"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>


        {/* 8. LATEST TRANSMISSIONS & BULLETINS */}
        <section className="relative z-20 py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="cyber-badge text-white/80">MRC://TRANSMISSIONS_FEED</span>
            </div>
            <span className="text-[11px] font-mono text-white/40">SYSTEM BROADCAST</span>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="cyber-card p-5 md:p-6 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#00d6ff] border border-white/10">
                      {ann.category}
                    </span>
                    <span className="text-xs font-mono text-white/40">{ann.publishedAt}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{ann.title}</h4>
                  <p className="text-xs text-white/60 mt-1 max-w-3xl leading-relaxed">{ann.content}</p>
                </div>
                <div className="text-xs font-mono text-white/40 shrink-0">
                  By {ann.author}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Left Preferences Menu with Smooth Scroll Toggle & Momentum Presets */}
        <PreferencesMenu
          smoothScroll={smoothScroll}
          onToggleSmoothScroll={handleToggleSmoothScroll}
          scrollIntensity={scrollIntensity}
          onChangeIntensity={handleChangeIntensity}
        />

        {/* Event Registration Modal */}
        {selectedEventForModal && (
          <EventRegisterModal
            event={selectedEventForModal}
            onClose={() => setSelectedEventForModal(null)}
          />
        )}

        {/* 9. CYBERNETIC FOOTER (INSPIRED BY MANARATSCIENCE.CLUB) */}
        <footer className="relative z-20 border-t border-white/10 bg-[#040406] py-16 text-white/70">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#00d6ff] flex items-center justify-center font-mono font-bold text-black text-xs shadow-[0_0_15px_rgba(0,214,255,0.4)]">
                    MRC
                  </div>
                  <span className="font-bold text-lg text-white">Manarat Robotics Club</span>
                </div>
                <p className="text-xs text-white/50 max-w-md leading-relaxed mb-6">
                  Where curiosity meets mechanical precision. The student-led robotics society of Manarat Dhaka International School &amp; College, building autonomous machines and competing at the national level.
                </p>
                <div className="text-xs font-mono text-white/40 space-y-1">
                  <p>Campus: Gulshan-2, Dhaka-1212, Bangladesh</p>
                  <p>Inquiries: info@manaratrobotics.club</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#00d6ff] mb-4">
                  Navigation
                </h4>
                <ul className="space-y-2 text-xs font-mono">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">Home Landing</Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-white transition-colors">Events &amp; Tournaments</Link>
                  </li>
                  <li>
                    <Link href="/projects" className="hover:text-white transition-colors">Robot Hardware Specs</Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-white transition-colors">Leadership &amp; Mentors</Link>
                  </li>
                  <li>
                    <Link href="/join" className="hover:text-white transition-colors">Recruitment Waitlist</Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#00d6ff] mb-4">
                  Portals &amp; System
                </h4>
                <ul className="space-y-2 text-xs font-mono">
                  <li>
                    <Link href="/login" className="hover:text-white transition-colors">Member Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-white transition-colors">Executive Command Center</Link>
                  </li>
                  <li>
                    <span className="text-white/30">Hardware Tracker (Phase 2)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
              <p>© {new Date().getFullYear()} Manarat Robotics Club. All rights reserved.</p>
              <p>
                Developed with pride by <span className="text-[#00d6ff]">Manarat Robotics Club</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
