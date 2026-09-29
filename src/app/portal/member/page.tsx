"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getClientSession, clearClientSession } from "@/lib/auth";
import { User, ClubEvent } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Calendar,
  Code2,
  Download,
  LogOut,
  Sparkles,
  Cpu,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function MemberPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);

  useEffect(() => {
    const session = getClientSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session);

    async function loadData() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) setEvents(data.events);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    clearClientSession();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Top Bar with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="cyber-badge text-[#00d6ff]">MEMBER PORTAL // ONLINE</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white">
              Welcome, <span className="text-[#00d6ff]">{user.name}</span>
            </h1>
            <p className="text-xs font-mono text-white/50 mt-1">
              Member ID: {user.studentId} • Batch {user.joinedYear} • Active Status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Member Digital ID Pass */}
          <div className="lg:col-span-1">
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-[#00d6ff]/30 relative overflow-hidden bg-gradient-to-br from-[#0c101a] to-[#07080d] shadow-[0_15px_40px_rgba(0,214,255,0.1)]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#ff6b35] flex items-center justify-center font-mono font-bold text-black text-[10px]">
                    M
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-white">
                    MANARAT ROBOTICS
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <p className="text-xs font-mono text-[#ff6b35]">{user.title}</p>
                  <p className="text-[10px] font-mono text-white/40 mt-1">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono border-t border-white/5 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/40">STUDENT ID</span>
                  <span className="text-white font-medium">{user.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">SECURITY LEVEL</span>
                  <span className="text-[#00d6ff] font-medium">TIER 1 (MEMBER)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">LAB ACCESS</span>
                  <span className="text-emerald-400 font-medium">AUTHORIZED</span>
                </div>
              </div>

              {/* Fake QR barcode simulation */}
              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 flex items-center justify-between font-mono text-[9px] text-white/40">
                <span>PASS_HASH: 0x9F41_MRC_SYS</span>
                <span>ROOM 402 PERMIT</span>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Member Tools & Resources */}
          <div className="lg:col-span-2 space-y-8">
            {/* Downloadable Internal Resources */}
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#00d6ff]" />
                  <h3 className="text-lg font-bold uppercase text-white font-mono">
                    Engineering Resources &amp; Firmware
                  </h3>
                </div>
                <span className="cyber-badge text-white/40">LAB VAULT</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-[#00d6ff]/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      STM32 2000Hz PID Line-Tracking Algorithm (.cpp)
                    </h4>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Differential speed calculations with discrete error derivative filtering.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Downloading starter firmware template...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00d6ff] hover:text-black transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-[#00d6ff]/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      ESP32 Real-Time WebSocket Telemetry HUD (.ino)
                    </h4>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Streams battery voltage, motor RPM, and optical sensor values live to browser.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Downloading ESP32 telemetry sketch...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00d6ff] hover:text-black transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-[#00d6ff]/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Apex LFR 16-Sensor Gerber PCB Package (.zip)
                    </h4>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Complete KiCAD schematic and 2-layer PCB fabrication files ready for JLCPCB.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Downloading KiCad Gerber zip...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00d6ff] hover:text-black transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Workshops & Schedule */}
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff6b35]" />
                  <h3 className="text-lg font-bold uppercase text-white font-mono">
                    Member Workshop Passes
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-xs font-mono text-[#00d6ff] hover:underline"
                >
                  Browse All
                </Link>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div>
                      <span className="text-[10px] text-[#ff6b35] uppercase font-bold">
                        {evt.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{evt.title}</h4>
                      <div className="flex items-center gap-4 text-white/50 text-[11px] mt-1">
                        <span>{evt.date}</span>
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center shrink-0">
                      Access Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-6 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Member Terminal.</p>
      </footer>
    </div>
  );
}
