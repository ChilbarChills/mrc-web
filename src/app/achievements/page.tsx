"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { initialAchievements } from "@/lib/seed-data";
import { Achievement } from "@/lib/types";
import {
  Trophy,
  Award,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch("/api/achievements");
        const data = await res.json();
        if (data.success && data.achievements?.length > 0) {
          setAchievements(data.achievements);
        }
      } catch (err) {
        console.error("Failed to load achievements", err);
      }
    }
    loadAchievements();
  }, []);

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between selection:bg-[#00d6ff]/20">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
            <Trophy className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span className="cyber-badge text-[#00d6ff]">HALL OF VICTORY // COMPETITIVE HONORS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Club <span className="text-[#00d6ff]">Achievements</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed font-light">
            National titles, tournament triumphs, and international qualifications earned by Manarat Robotics Club teams across collegiate and junior divisions.
          </p>
        </div>

        {/* Global Qualification Highlight Banner */}
        <div className="cyber-card p-6 md:p-8 rounded-3xl border border-[#00d6ff]/30 bg-gradient-to-r from-[#0050ff]/15 via-[#00d6ff]/10 to-transparent mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d6ff]/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00d6ff]/20 border border-[#00d6ff]/40 flex items-center justify-center text-[#00d6ff] shrink-0">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#00d6ff] block mb-1 font-bold">
                  INTERNATIONAL STAGE QUALIFICATION
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Rome, Italy 🇮🇹 &amp; Japan 🇯🇵
                </h2>
                <p className="text-xs md:text-sm text-white/70 max-w-2xl leading-relaxed font-light">
                  MRC teams have qualified for multiple world championships: <span className="text-white font-semibold">Team Red Roc</span> &amp; <span className="text-white font-semibold">Team Tarabari</span> to Rome, Italy (FIRSO), and <span className="text-white font-semibold">Team RedRoc</span> to the World Robot Games in Japan!
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-white/80 shrink-0 self-start md:self-center">
              <Sparkles className="w-4 h-4 text-[#00d6ff]" />
              <span>World Stage 2026</span>
            </div>
          </div>
        </div>

        {/* Achievements Showcase Cards */}
        <div className="space-y-12">
          {achievements.map((item, idx) => (
            <div
              key={item.id}
              className="cyber-card rounded-3xl p-6 md:p-10 border border-white/10 hover:border-[#00d6ff]/40 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                {/* Image Showcase */}
                {item.image && (
                  <div className="w-full lg:w-1/2 flex flex-col gap-3 shrink-0">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black/40 relative group shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white font-semibold">
                          <Award className="w-3.5 h-3.5 text-[#00d6ff]" />
                          <span>Showcase Photo</span>
                        </span>
                        {item.badge && (
                          <span className="px-3 py-1 rounded-full bg-[#00d6ff] text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,214,255,0.4)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.images && item.images.length > 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {item.images.map((imgSrc, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10 hover:border-[#00d6ff]/40 transition-colors bg-black/30"
                          >
                            <img
                              src={imgSrc}
                              alt={`${item.title} ${imgIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Information */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                        RECORD 0{idx + 1}
                      </span>
                      <span className="text-white/20 text-xs">•</span>
                      <span className="text-[10px] font-mono text-[#86A8CF] tracking-wide uppercase">
                        {item.competition}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-4 leading-snug">
                      {item.title}
                    </h2>

                    <p className="text-sm text-white/70 leading-relaxed font-light mb-6">
                      {item.description}
                    </p>

                    {/* Team & Category Breakdown */}
                    <div className="space-y-3 mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      {item.teams.map((t, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 last:pb-0 border-b last:border-b-0 border-white/5"
                        >
                          <div>
                            <span className="text-sm font-bold text-white block">
                              {t.name}
                            </span>
                            <span className="text-xs font-mono text-white/50">
                              {t.grade} • {t.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#00d6ff]/15 border border-[#00d6ff]/30 text-[#00d6ff] font-mono text-xs font-semibold">
                              {t.award}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Location & Qualification Details */}
                    <div className="space-y-2 text-xs font-mono text-white/50 mb-6">
                      {item.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#00d6ff]" />
                          <span>Venue: {item.venue} ({item.stage})</span>
                        </div>
                      )}
                      {item.qualification && (
                        <div className="flex items-center gap-2 text-[#00d6ff]">
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-semibold">{item.qualification}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40">
                      Manarat Robotics Club • Competitive Archive
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#00d6ff]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Title</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Competitive Achievements Archive.</p>
      </footer>
    </div>
  );
}
