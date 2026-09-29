"use client";

import Navbar from "@/components/Navbar";
import { initialProjects } from "@/lib/seed-data";
import { Cpu, Zap, Activity, ShieldCheck, ExternalLink, Award } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span className="cyber-badge text-[#00d6ff]">HARDWARE LABORATORY</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Robot <span className="text-[#00d6ff]">Portfolio</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            Detailed engineering breakdowns of competitive machines built by Manarat Robotics Club members.
          </p>
        </div>

        {/* Projects Breakdown */}
        <div className="space-y-12">
          {initialProjects.map((project, idx) => (
            <div
              key={project.id}
              className="cyber-card rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-8 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono text-[#00d6ff] font-bold tracking-widest uppercase">
                      BUILD 0{idx + 1} // {project.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {project.status}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
                    {project.name}
                  </h2>

                  <p className="text-sm text-white/70 leading-relaxed mb-6 font-light max-w-2xl">
                    {project.description}
                  </p>

                  {/* Highlights / Achievements */}
                  <div className="mb-6">
                    <span className="text-[11px] font-mono uppercase text-white/40 block mb-2">
                      Achievements &amp; Honors
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.achievements.map((ach) => (
                        <div
                          key={ach}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80"
                        >
                          <Award className="w-3.5 h-3.5 text-[#00d6ff]" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authors */}
                  <div className="text-xs font-mono text-white/40">
                    Lead Engineers:{" "}
                    <span className="text-white/80">{project.team.join(", ")}</span>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="w-full lg:w-96 rounded-2xl bg-black/60 border border-white/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <span className="text-xs font-mono uppercase text-[#00d6ff] font-bold tracking-wider">
                        Hardware Specifications
                      </span>
                      <Activity className="w-4 h-4 text-[#00d6ff]" />
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      {project.specs.map((spec) => (
                        <div key={spec.label} className="border-b border-white/5 pb-2">
                          <span className="text-white/40 text-[10px] block uppercase">
                            {spec.label}
                          </span>
                          <span className="text-white font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block">TOP RECORDED SPEED</span>
                      <span className="text-lg font-mono font-bold text-[#00d6ff]">{project.speed}</span>
                    </div>
                    <Link
                      href="/events"
                      className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-[#00d6ff] hover:text-black font-mono text-[11px] uppercase tracking-wider font-semibold transition-all"
                    >
                      Watch in Arena
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Hardware Archives.</p>
      </footer>
    </div>
  );
}
