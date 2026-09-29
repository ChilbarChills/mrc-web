"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getClientSession } from "@/lib/auth";
import { User } from "@/lib/types";
import { LogIn, UserCheck, ShieldAlert, Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getClientSession());
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3.5 transition-all duration-300 ${
        isScrolled
          ? "bg-[#06070a]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent"
      }`}
    >
      {/* Brand Logo */}
      <Link href="/" className="group flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0050ff] to-[#00d6ff] p-[1px] shadow-[0_0_15px_rgba(0,214,255,0.4)]">
          <div className="w-full h-full bg-[#050508] rounded-[7px] flex items-center justify-center">
            <span className="font-mono text-xs font-black text-white group-hover:text-[#00d6ff] transition-colors">
              M
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#00d6ff] transition-colors">
            MRC
          </span>
          <span className="text-[9px] font-mono tracking-[0.22em] text-white/40 uppercase">
            Manarat Robotics
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center space-x-7 text-xs font-mono uppercase tracking-[0.18em] text-white/70">
        <Link href="/" className="hover:text-[#00d6ff] transition-colors">
          Home
        </Link>
        <Link href="/#tracks" className="hover:text-[#00d6ff] transition-colors">
          Focus Tracks
        </Link>
        <Link href="/events" className="hover:text-[#00d6ff] transition-colors">
          Events
        </Link>
        <Link href="/projects" className="hover:text-[#00d6ff] transition-colors">
          Robots
        </Link>
        <Link href="/team" className="hover:text-[#00d6ff] transition-colors">
          Leadership
        </Link>
        <Link
          href="/join"
          className="hover:text-[#00d6ff] transition-colors flex items-center gap-1.5"
        >
          <span>Recruitment</span>
          <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#00d6ff]/20 text-[#00d6ff] border border-[#00d6ff]/30">
            Soon
          </span>
        </Link>
      </div>

      {/* Right Controls / Auth Portal CTA */}
      <div className="hidden sm:flex items-center gap-3">
        {currentUser ? (
          <Link
            href={currentUser.role === "EXECUTIVE" ? "/portal/executive" : "/portal/member"}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00d6ff]/40 bg-[#00d6ff]/10 hover:bg-[#00d6ff]/20 text-xs font-mono tracking-wider text-white transition-all shadow-[0_0_15px_rgba(0,214,255,0.2)]"
          >
            {currentUser.role === "EXECUTIVE" ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#00d6ff]" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-[#00d6ff]" />
            )}
            <span>{currentUser.name.split(" ")[0]}</span>
            <span className="text-[9px] px-1 rounded bg-white/10 text-white/60">
              {currentUser.role === "EXECUTIVE" ? "EXEC" : "MEMBER"}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-white/90 bg-white/[0.04] border border-white/10 hover:border-[#00d6ff]/50 hover:bg-white/[0.08] transition-all shadow-[0_0_15px_rgba(0,214,255,0.1)]"
            >
              <LogIn className="w-3.5 h-3.5 text-[#00d6ff]" />
              <span>Portal Login</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[56px] left-0 right-0 bg-[#07080d]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 text-sm font-mono uppercase tracking-wider">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white hover:text-[#00d6ff]"
          >
            Home
          </Link>
          <Link
            href="/#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white/70 hover:text-[#00d6ff]"
          >
            Focus Tracks
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white/70 hover:text-[#00d6ff]"
          >
            Events &amp; Competitions
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white/70 hover:text-[#00d6ff]"
          >
            Robot Projects
          </Link>
          <Link
            href="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white/70 hover:text-[#00d6ff]"
          >
            Leadership
          </Link>
          <Link
            href="/join"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/5 text-white/70 hover:text-[#00d6ff] flex items-center justify-between"
          >
            <span>Recruitment</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-[#00d6ff]/20 text-[#00d6ff]">Opening Soon</span>
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-3 text-center rounded-xl bg-[#00d6ff]/15 border border-[#00d6ff]/40 text-[#00d6ff] font-semibold"
          >
            Portal Login
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
