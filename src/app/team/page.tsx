"use client";

import Navbar from "@/components/Navbar";
import { initialUsers } from "@/lib/seed-data";
import { ShieldCheck, Mail, Award, BookOpen, Compass, User } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  const advisors = initialUsers.filter((u) => u.title.includes("Advisor") || u.title.includes("Mentor"));
  const studentLeaders = initialUsers.filter((u) => !u.title.includes("Advisor") && !u.title.includes("Mentor"));

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="cyber-badge text-emerald-400">LEADERSHIP &amp; MENTORSHIP</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Club <span className="text-[#00d6ff]">Leadership</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            The faculty advisors and student executives driving the engineering direction and national competition representation of Manarat Robotics Club.
          </p>
        </div>

        {/* Faculty Advisors Section */}
        <div className="mb-16">
          <div className="border-b border-white/10 pb-4 mb-8">
            <h2 className="text-xl font-mono uppercase tracking-widest text-[#ff6b35]">
              Faculty Advisors &amp; Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advisors.map((advisor) => (
              <div key={advisor.id} className="cyber-card p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/70 shadow-[0_0_15px_rgba(255,255,255,0.05)] shrink-0">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{advisor.name}</h3>
                      <p className="text-xs font-mono text-[#00d6ff] uppercase tracking-wider">
                        {advisor.title}
                      </p>
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                        ID: {advisor.studentId}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light mb-6">
                    {advisor.bio}
                  </p>
                </div>

                <div className="text-xs font-mono text-white/40 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span>Manarat Dhaka International College</span>
                  <a
                    href={`mailto:${advisor.email}`}
                    className="text-[#ff6b35] hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Executive Committee */}
        <div>
          <div className="border-b border-white/10 pb-4 mb-8">
            <h2 className="text-xl font-mono uppercase tracking-widest text-[#00d6ff]">
              Student Executive Board
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentLeaders.map((member) => (
              <div key={member.id} className="cyber-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#00d6ff]/30 mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-xs font-mono text-[#ff6b35] mb-2">{member.title}</p>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{member.bio}</p>
                </div>

                <div className="text-[10px] font-mono text-white/40 pt-3 border-t border-white/5 flex justify-between">
                  <span>Batch: {member.joinedYear}</span>
                  <span className="text-emerald-400 font-semibold">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Leadership Roster.</p>
      </footer>
    </div>
  );
}
