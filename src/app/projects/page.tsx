"use client";

import Navbar from "@/components/Navbar";
import { Cpu, Clock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between selection:bg-[#00d6ff]/20">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-6">
          <Clock className="w-3.5 h-3.5 text-[#00d6ff] animate-pulse" />
          <span className="cyber-badge text-[#00d6ff]">HARDWARE &amp; RESEARCH ARCHIVE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-4">
          Robot <span className="text-[#00d6ff]">Portfolio</span>
        </h1>

        {/* Cyber Card Container */}
        <div className="w-full max-w-2xl cyber-card rounded-3xl p-8 md:p-14 border border-white/10 mt-6 relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00d6ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#0050ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-[#00d6ff]/10 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff] mx-auto mb-6 shadow-[0_0_30px_rgba(0,214,255,0.2)]">
            <Cpu className="w-8 h-8" />
          </div>

          <div className="inline-block px-3 py-1 rounded bg-[#00d6ff]/15 border border-[#00d6ff]/30 text-xs font-mono text-[#00d6ff] tracking-widest uppercase mb-4 font-bold">
            STATUS // UNDER ACTIVE CONSTRUCTION
          </div>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-3 tracking-wide">
            Coming Soon
          </h2>

          <p className="text-sm md:text-base text-white/60 leading-relaxed font-light max-w-lg mx-auto mb-8">
            Our robotics engineering team is currently archiving and documenting the official hardware blueprints, schematics, and tournament competition robots. Detailed project breakdowns will be published shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-wider uppercase transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00d6ff]/10 hover:bg-[#00d6ff]/20 border border-[#00d6ff]/30 text-xs font-mono tracking-wider text-[#00d6ff] uppercase transition-all shadow-[0_0_20px_rgba(0,214,255,0.15)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Meet The Committee</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Hardware Laboratory.</p>
      </footer>
    </div>
  );
}
