"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ArrowRight, Bell, Sparkles, Shield, Cpu, Flame, Users } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "Computer Science & Engineering",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      alert("Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-4xl mx-auto w-full flex-1">
        {/* Status Badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff6b35]/40 bg-[#ff6b35]/10 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] animate-ping" />
            <span className="cyber-badge text-[#ff6b35]">ANNOUNCEMENT // INTAKE STATUS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Recruitment Applications<br />
            <span className="text-[#00d6ff]">Will Open Soon</span>
          </h1>

          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            The next official induction cycle for the Manarat Robotics Club is currently being scheduled. Join our priority notification waitlist to be alerted the exact moment applications unlock.
          </p>
        </div>

        {/* Priority Notification Form Card */}
        <div className="cyber-card p-8 md:p-12 rounded-3xl border border-white/10 mb-14 relative overflow-hidden bg-gradient-to-b from-[#0e111a] to-[#07080d]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d6ff]/5 blur-[100px] pointer-events-none rounded-full" />

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="cyber-badge text-emerald-400">PRIORITY ENTRY RECORDED</span>
              <h2 className="text-2xl font-bold text-white mt-2 mb-2">You Are On The Waitlist!</h2>
              <p className="text-xs text-white/60 max-w-md mx-auto mb-6">
                Your credentials have been securely stored in the MRC applicant database. When the executive panel opens interview slots, you will receive first-wave instructions.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono uppercase tracking-wider text-white"
              >
                <span>Check Out Current Events in the Meantime</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00d6ff]" />
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <Bell className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-xs font-mono uppercase tracking-wider text-white/80 font-bold">
                  Priority Intake Alert Registration
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahir Faisal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase">Student Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your.id@student.manarat.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase">Student / College ID</label>
                    <input
                      type="text"
                      placeholder="e.g. B26-CS-041"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase">Academic Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0d14] border border-white/10 text-white focus:outline-none focus:border-[#00d6ff]"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                      <option value="Electrical & Electronic Engineering">Electrical &amp; Electronic Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="High School Science / O-A Levels">High School Science / O-A Levels</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#ff6b35] hover:bg-[#ff8252] text-black font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_25px_rgba(255,107,53,0.35)] flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Recording..." : "Notify Me When Applications Open"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* What to expect as an MRC Member */}
        <div>
          <div className="text-center mb-8">
            <span className="cyber-badge text-[#00d6ff]">WHAT TO EXPECT</span>
            <h3 className="text-2xl font-bold uppercase text-white mt-1">Why Build With MRC?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Cpu className="w-6 h-6 text-[#00d6ff] mb-3" />
              <h4 className="text-base font-bold text-white mb-2">Hardware Lab Access</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Direct access to oscilloscopes, SMD rework stations, 3D printers, and microcontrollers (STM32, ESP32, Arduino).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Flame className="w-6 h-6 text-[#ff6b35] mb-3" />
              <h4 className="text-base font-bold text-white mb-2">National Tournaments</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Represent Manarat in national Line Following, Robosoccer, and Drone racing arenas across colleges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Users className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="text-base font-bold text-white mb-2">Hands-On Mentorship</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Learn firmware architecture, PID feedback loops, and motor driver layout directly from senior builders.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Recruitment Hub.</p>
      </footer>
    </div>
  );
}
