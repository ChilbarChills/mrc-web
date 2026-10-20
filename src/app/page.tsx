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
import { initialProjects, initialUsers } from "@/lib/seed-data";
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
  Globe,
  Share2,
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
        className={`flex min-h-screen flex-col bg-[#070E1A] text-white transition-opacity duration-1000 ${
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

        {/* 2. QUICK STATS */}
        <section className="relative z-20 border-y border-[#86A8CF]/15 bg-[#0D1B2A] py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 border-r border-white/5">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white block">
                  100<span className="text-[#00d6ff]">+</span>
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Active Members
                </span>
              </div>

              <div className="p-4">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-[#E1CBD7] block">
                  2+
                </span>
                <span className="text-[11px] font-mono tracking-[0.24em] text-white/50 uppercase mt-1 block">
                  Years Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT MRC // GENERAL OVERVIEW ARTICLE (TRIMMED & DEPARTMENT BREAKDOWN) */}
        <section id="about" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#00d6ff]" />
              <span className="cyber-badge text-[#00d6ff]">ABOUT MRC // EST. 2024</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white mb-6">
              Shaping Minds. <span className="text-[#00d6ff]">Forged in Hardware.</span>
            </h2>
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#142032] to-[#070E1A] text-white/80 leading-relaxed text-sm md:text-base space-y-4">
              <p>
                Established in <span className="text-white font-semibold">2024</span>, Manarat Robotics Club (MRC) plays a crucial role in shaping the bright minds of the students of Manarat. The club and its members have stacked achievements, secured accolades, and hit ambitious engineering goals.
              </p>
              <p>
                Every <span className="text-[#00d6ff] font-semibold">Thursday after school</span>, MRC runs hands-on sessions for curious and motivated students of Manarat—giving them a clear idea of how robotics and AI actually matter in the real world. With little to no boring theory, students work closely with real components, learn how systems are controlled through code, build practical skills, and showcase pure skill on competitive stages.
              </p>
              <p className="text-xs font-mono text-[#86A8CF]">
                Operated by an executive board and four specialized departments, each driving the club forward:
              </p>
            </div>
          </div>

          {/* Four Core Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dept 01: Technology */}
            <div className="cyber-card p-6 md:p-7 rounded-2xl border border-white/10 hover:border-[#00d6ff]/40 transition-all group">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                DEPARTMENT 01
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#0050ff]/20 border border-[#0050ff]/40 flex items-center justify-center text-[#00d6ff] mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white mb-2">Technology Dept.</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Handles robotics design, bare-metal C++ coding, electronics, and technical operations—the primary engine of the club.
              </p>
            </div>

            {/* Dept 02: Event Management */}
            <div className="cyber-card p-6 md:p-7 rounded-2xl border border-white/10 hover:border-[#00d6ff]/40 transition-all group">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                DEPARTMENT 02
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00d6ff]/15 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff] mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white mb-2">Event Management</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Plans and executes practical workshops, bootcamps, and national tournaments like Robofest, keeping activities on track.
              </p>
            </div>

            {/* Dept 03: Communication */}
            <div className="cyber-card p-6 md:p-7 rounded-2xl border border-white/10 hover:border-[#C38EB4]/40 transition-all group">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                DEPARTMENT 03
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#C38EB4]/15 border border-[#C38EB4]/30 flex items-center justify-center text-[#C38EB4] mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white mb-2">Communication Dept.</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Handles social media, student outreach, institutional partners, and sponsors to keep the club prominent and visible.
              </p>
            </div>

            {/* Dept 04: Media */}
            <div className="cyber-card p-6 md:p-7 rounded-2xl border border-white/10 hover:border-[#E1CBD7]/40 transition-all group">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                DEPARTMENT 04
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#E1CBD7]/15 border border-[#E1CBD7]/30 flex items-center justify-center text-[#E1CBD7] mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white mb-2">Media Dept.</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Designs clean graphics, tournament posters, build logs, and video highlights that represent our engineering triumphs.
              </p>
            </div>
          </div>
        </section>

        {/* 4. EVENTS & WORKSHOPS (FEATURING IUT WORKSHOP & ROBOFEST) */}
        <section id="events" className="relative z-20 py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
                <Calendar className="w-3.5 h-3.5 text-[#00d6ff]" />
                <span className="cyber-badge text-[#00d6ff]">FIELD SCHEDULE // WORKSHOPS &amp; ARENAS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
                Events &amp; <span className="text-[#00d6ff]">Workshops</span>
              </h2>
              <p className="text-xs md:text-sm text-white/60 max-w-xl mt-2 font-light">
                Hands-on training sessions and premier collegiate competitions, featuring the IUT Robotics Workshop and Robofest National Championship.
              </p>
            </div>
            <Link
              href="/events"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 border-b border-white/20 pb-1 shrink-0"
            >
              <span>View Full Events Calendar</span>
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
                          : "bg-[#C38EB4]/15 text-[#C38EB4] border border-[#C38EB4]/30"
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
                      <span className="truncate">{event.venue}</span>
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

        {/* 5. VIEW OUR PROJECTS (WITH BRIEF EXPLANATION & TEAM MEMBERS INVOLVED) */}
        <section id="projects" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C38EB4]/30 bg-[#C38EB4]/10 mb-4">
                <Cpu className="w-3.5 h-3.5 text-[#C38EB4]" />
                <span className="cyber-badge text-[#C38EB4]">PROJECTS &amp; HARDWARE INNOVATION</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
                View Our <span className="text-[#00d6ff]">Projects</span>
              </h2>
              <p className="text-xs md:text-sm text-white/60 max-w-xl mt-2 font-light">
                Custom robotics platforms engineered by MRC members—including competitive line followers, holonomic robosoccer strikers, and autonomous flight systems.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 border-b border-white/20 pb-1 shrink-0"
            >
              <span>View All Projects &amp; Complete Specs</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00d6ff]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {initialProjects.map((project, idx) => (
              <div
                key={project.id}
                className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#00d6ff]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                      BUILD 0{idx + 1} // {project.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E1CBD7]/15 text-[#E1CBD7] border border-[#E1CBD7]/30">
                      {project.status === "ACTIVE_COMPETITION" ? "ACTIVE COMP" : "IN DEVELOPMENT"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00d6ff] transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs text-white/60 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Key Hardware Specs */}
                  <div className="space-y-2 text-xs font-mono mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">SPEED</span>
                      <span className="text-white font-semibold">{project.speed}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">CONTROLLER</span>
                      <span className="text-[#00d6ff] font-semibold">{project.controller}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">SENSORS</span>
                      <span className="text-white/70 font-semibold truncate max-w-[170px]">{project.sensors}</span>
                    </div>
                  </div>

                  {/* Team Members Involved */}
                  <div className="pt-3 border-t border-white/10 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#86A8CF] block mb-2.5">
                      Engineered By:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.team.map((memberName, mIdx) => {
                        const matchedUser = initialUsers.find((u) => u.name === memberName);
                        return (
                          <div
                            key={mIdx}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono"
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#00d6ff]/20 shrink-0 border border-[#00d6ff]/40">
                              {matchedUser?.avatar ? (
                                <img
                                  src={matchedUser.avatar}
                                  alt={memberName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-3 h-3 text-[#00d6ff] m-auto" />
                              )}
                            </div>
                            <span className="text-white font-medium text-[11px]">{memberName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Link
                  href="/projects"
                  className="text-xs font-mono text-[#00d6ff] uppercase tracking-wider flex items-center gap-1.5 hover:underline pt-2 border-t border-white/5"
                >
                  <span>Read Full Engineering Log</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. JOIN THE CLUB (RECRUITMENT SECTION AS REQUESTED) */}
        <section id="join" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="cyber-card rounded-3xl p-8 md:p-14 border border-[#86A8CF]/20 relative overflow-hidden bg-gradient-to-br from-[#1A2C40] via-[#0D1B2A] to-[#070E1A]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00d6ff]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/40 bg-[#00d6ff]/15 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00d6ff] animate-ping" />
                <span className="cyber-badge text-[#00d6ff]">RECRUITMENT // JOIN THE CLUB</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 leading-tight">
                Join the <span className="text-[#00d6ff]">Club</span>
              </h2>

              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8">
                Official intake applications for the upcoming academic season will <span className="text-white font-semibold">open soon</span>. Whether you are passionate about writing firmware, soldering custom micro-PCBs, building mechanical gearboxes, or organizing national tournaments, MRC is the place to level up.
              </p>

              {waitlistSuccess ? (
                <div className="p-6 rounded-2xl bg-[#E1CBD7]/10 border border-[#E1CBD7]/30 text-[#E1CBD7] font-mono text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold block">You're on the Priority Notification List!</span>
                    <span className="text-xs text-[#E1CBD7]/80">
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
                      className="px-4 py-3 rounded-xl bg-[#0D1B2A] border border-[#86A8CF]/20 text-white focus:outline-none focus:border-[#00d6ff]"
                    >
                      <option value="Technology Department">Interest: Technology (Robotics &amp; Coding)</option>
                      <option value="Event Management Department">Interest: Event Management (Workshops)</option>
                      <option value="Communication Department">Interest: Communication &amp; Outreach</option>
                      <option value="Media Department">Interest: Media &amp; Visual Design</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-[#00d6ff] hover:bg-[#38e1ff] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,214,255,0.3)] flex items-center justify-center gap-2"
                  >
                    <span>{waitlistSubmitting ? "Registering..." : "Join Priority Notification List"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 7. CONTACT & LOCATION SECTION (SCHOOL ADDRESS, EMAIL, SOCIALS, GOOGLE MAP EMBED) */}
        <section id="contact" className="relative z-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#00d6ff]" />
                <span className="cyber-badge text-[#00d6ff]">CONTACT &amp; HEADQUARTERS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
                Contact &amp; <span className="text-[#00d6ff]">Location</span>
              </h2>
              <p className="text-xs md:text-sm text-white/60 max-w-xl mt-2 font-light">
                Visit the Manarat Robotics Lab or reach out directly to the executive committee for workshop inquiries and event participation.
              </p>
            </div>
            <Link
              href="/contact"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 border-b border-white/20 pb-1 shrink-0"
            >
              <span>Dedicated Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00d6ff]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Details Cards */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              {/* School Address Card */}
              <div className="cyber-card p-6 rounded-2xl border border-white/10 hover:border-[#00d6ff]/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00d6ff]/10 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                      SCHOOL ADDRESS
                    </span>
                    <p className="text-sm font-semibold text-white leading-snug">
                      H.No 16, Road No. 104, QCRC+97G, Rd 104, Dhaka 1212
                    </p>
                    <p className="text-[11px] text-[#86A8CF] mt-1">
                      Manarat Dhaka International School &amp; College, Gulshan-2
                    </p>
                  </div>
                </div>
              </div>

              {/* Club Email Card */}
              <div className="cyber-card p-6 rounded-2xl border border-white/10 hover:border-[#00d6ff]/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0050ff]/15 border border-[#0050ff]/30 flex items-center justify-center text-[#00d6ff] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                      CLUB EMAIL
                    </span>
                    <a
                      href="mailto:contact@manaratrobotics.club"
                      className="text-sm font-semibold text-white hover:text-[#00d6ff] transition-colors block"
                    >
                      contact@manaratrobotics.club
                    </a>
                    <span className="text-[11px] text-white/40 mt-1 block">
                      General inquiries &amp; tournament confirmations
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="cyber-card p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-4 h-4 text-[#00d6ff]" />
                  <span className="text-white font-bold uppercase tracking-wider text-xs">
                    Social Media Channels
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/manaratrobotics/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#C38EB4]/50 hover:bg-[#C38EB4]/10 text-white/80 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="font-semibold">Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C38EB4]" />
                  </a>
                  <a
                    href="https://discord.gg/8HJ6JQK5ev"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#00d6ff]/50 hover:bg-[#00d6ff]/10 text-white/80 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="font-semibold">Discord</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00d6ff]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="lg:col-span-7">
              <div className="cyber-card p-4 md:p-6 rounded-3xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00d6ff]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      Interactive Campus Map Embed
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00d6ff] bg-[#00d6ff]/10 px-2 py-0.5 rounded border border-[#00d6ff]/20">
                    DHAKA 1212
                  </span>
                </div>
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#86A8CF]/20 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <iframe
                    title="Manarat Robotics Club Location Embed"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://maps.google.com/maps?q=H.No%2016%2C%20Road%20No.%20104%2C%20Dhaka%201212&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full filter invert-[0.92] hue-rotate-[180deg] contrast-[1.15]"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mt-3 px-2">
                  <span>Pin: H.No 16, Road No. 104, Gulshan-2</span>
                  <a
                    href="https://maps.google.com/?q=H.No+16,+Road+No.+104,+Dhaka+1212"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00d6ff] hover:underline flex items-center gap-1"
                  >
                    <span>View Larger Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
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
        <footer className="relative z-20 border-t border-[#86A8CF]/15 bg-[#040C16] py-16 text-white/70">
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
                <div className="text-xs font-mono text-white/50 space-y-1.5">
                  <p className="text-white/80 font-medium">H.No 16, Road No. 104, QCRC+97G, Rd 104, Dhaka 1212</p>
                  <p>Campus: Manarat Dhaka International School &amp; College, Gulshan-2</p>
                  <p>Club Email: <a href="mailto:contact@manaratrobotics.club" className="text-[#00d6ff] hover:underline">contact@manaratrobotics.club</a></p>
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
                    <Link href="/#about" className="hover:text-white transition-colors">About MRC</Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-white transition-colors">Events &amp; Workshops</Link>
                  </li>
                  <li>
                    <Link href="/projects" className="hover:text-white transition-colors">View Our Projects</Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-white transition-colors">Team &amp; Leadership</Link>
                  </li>
                  <li>
                    <Link href="/join" className="hover:text-white transition-colors">Join the Club</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact &amp; Location</Link>
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
