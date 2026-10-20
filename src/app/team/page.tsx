"use client";

import Navbar from "@/components/Navbar";
import { initialUsers } from "@/lib/seed-data";
import { ShieldCheck, Layers, Cpu, Radio, Activity, Film } from "lucide-react";

export default function TeamPage() {
  const execMembers = initialUsers.filter((u) => u.role === "EXECUTIVE");
  const projectMembers = initialUsers.filter((u) => u.title.includes("Projects"));
  const itMembers = initialUsers.filter((u) => u.title.includes("IT"));
  const commMembers = initialUsers.filter((u) => u.title.includes("Communications"));
  const actMembers = initialUsers.filter((u) => u.title.includes("Activity"));
  const mediaMembers = initialUsers.filter((u) => u.title.includes("Media"));

  const sections = [
    {
      title: "Executive Board",
      icon: ShieldCheck,
      badge: "EXECUTIVE LEADERSHIP",
      members: execMembers,
    },
    {
      title: "Project Department",
      icon: Layers,
      badge: "HARDWARE & SYSTEMS",
      members: projectMembers,
    },
    {
      title: "IT Department",
      icon: Cpu,
      badge: "SOFTWARE & INFRASTRUCTURE",
      members: itMembers,
    },
    {
      title: "Communication Department",
      icon: Radio,
      badge: "PR & COMMUNITY",
      members: commMembers,
    },
    {
      title: "Activity Department",
      icon: Activity,
      badge: "OPERATIONS & EVENTS",
      members: actMembers,
    },
    {
      title: "Media Department",
      icon: Film,
      badge: "MEDIA & BRANDING",
      members: mediaMembers,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between selection:bg-[#00d6ff]/20">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-14 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span className="cyber-badge text-[#00d6ff]">COMMITTEE ROSTER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-3">
            Club <span className="text-[#00d6ff]">Committee</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            The committee members leading and managing Manarat Robotics Club.
          </p>
        </div>

        {/* Committee Sections */}
        <div className="space-y-16">
          {sections.map((section) => {
            const Icon = section.icon;
            if (section.members.length === 0) return null;

            return (
              <div key={section.title} className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-[#00d6ff]/10 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                      {section.title}
                    </h2>
                    <span className="text-[10px] font-mono tracking-widest text-[#86A8CF] uppercase">
                      {section.badge}
                    </span>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {section.members.map((member) => (
                    <div
                      key={member.id}
                      className="group cyber-card p-4 rounded-xl border border-white/10 hover:border-[#00d6ff]/50 transition-all duration-300 flex flex-col items-center text-center bg-white/[0.02] hover:bg-white/[0.04]"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/15 group-hover:border-[#00d6ff]/40 transition-colors mb-3.5 bg-black/40">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[#00d6ff] transition-colors leading-snug mb-1">
                        {member.name}
                      </h3>
                      <p className="text-xs font-mono text-[#00d6ff]/90 tracking-wide">
                        {member.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Official Committee Roster.</p>
      </footer>
    </div>
  );
}
