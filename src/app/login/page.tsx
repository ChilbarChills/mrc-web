"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { setClientSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  UserCheck,
  Key,
  Mail,
  ArrowRight,
  Sparkles,
  User as UserIcon,
  BadgeCheck,
  Layers,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "REGISTER">("SIGN_IN");

  // Sign In States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regDepartment, setRegDepartment] = useState("Technology");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (loginEmail: string, pass?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: pass }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      setClientSession(data.user);
      router.push(data.redirectTo);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          studentId: regStudentId,
          department: regDepartment,
          password: regPassword,
          role: "MEMBER",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      setClientSession(data.user);
      router.push(data.redirectTo);
    } catch {
      setError("Network error during registration.");
      setLoading(false);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide an email");
      return;
    }
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="cyber-card p-7 md:p-10 rounded-3xl border border-[#86A8CF]/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden bg-gradient-to-b from-[#142032] to-[#070E1A]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d6ff]/5 blur-[80px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0050ff] to-[#00d6ff] p-[1px] mx-auto mb-3">
              <div className="w-full h-full bg-[#070E1A] rounded-[11px] flex items-center justify-center font-mono font-bold text-white text-base">
                M
              </div>
            </div>
            <span className="cyber-badge text-[#00d6ff]">PORTAL GATEWAY</span>
            <h1 className="text-2xl font-black uppercase text-white mt-1">
              {authMode === "SIGN_IN" ? "MRC Access Terminal" : "Register Member ID"}
            </h1>
            <p className="text-xs text-white/50 mt-1">
              {authMode === "SIGN_IN"
                ? "Sign into Member Workspace or Executive Command"
                : "Create your verified club identity in the cloud database"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGN_IN");
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-1.5 ${
                authMode === "SIGN_IN"
                  ? "bg-[#00d6ff] text-black shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("REGISTER");
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-1.5 ${
                authMode === "REGISTER"
                  ? "bg-[#00d6ff] text-black shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {authMode === "SIGN_IN" && (
            <div className="space-y-6">
              {/* Quick Demo 1-Click Buttons */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2 text-center">
                  ⚡ Instant 1-Click Demo Login
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => handleLogin("executive@mrc.club")}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-[#0050ff]/20 hover:bg-[#0050ff]/30 border border-[#0050ff]/40 text-white font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#00d6ff]" />
                    <span>Executive Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogin("member@mrc.club")}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-[#00d6ff]/15 hover:bg-[#00d6ff]/25 border border-[#00d6ff]/30 text-[#00d6ff] font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Club Member</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0D1B2A] px-3 text-[10px] font-mono text-white/40 uppercase tracking-widest absolute">
                  or enter credentials
                </span>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-white/60 mb-1.5 uppercase">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      required
                      placeholder="student@manarat.edu or executive@mrc.club"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-1.5 uppercase">Password / Passcode</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#00d6ff] text-black hover:bg-[#38e0ff] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,214,255,0.25)] flex items-center justify-center gap-2 mt-2"
                >
                  <span>{loading ? "Authenticating..." : "Sign Into Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs font-mono text-white/40">
                <span>Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("REGISTER");
                    setError(null);
                  }}
                  className="text-[#00d6ff] hover:underline font-semibold"
                >
                  Create one now
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: REGISTER ACCOUNT */}
          {authMode === "REGISTER" && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-white/60 mb-1 uppercase">Full Student Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samin Yasar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 uppercase">Manarat Student ID *</label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-ENG-042"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 uppercase">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="student@manarat.edu or personal email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 uppercase">Core Department Interest</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#86A8CF]/20 text-white focus:outline-none focus:border-[#00d6ff]"
                  >
                    <option value="Technology">Technology &amp; Firmware Dept</option>
                    <option value="Media">Media &amp; Visual Design Dept</option>
                    <option value="Communication">Communication &amp; Outreach Dept</option>
                    <option value="Event Management">Event Management Dept</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 uppercase">Create Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    required
                    placeholder="Choose a secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#00d6ff] text-black hover:bg-[#38e0ff] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,214,255,0.25)] flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? "Creating Member Account..." : "Create Account & Enter Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs font-mono text-white/40 pt-2">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_IN");
                    setError(null);
                  }}
                  className="text-[#00d6ff] hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-6 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Unified Auth Service.</p>
      </footer>
    </div>
  );
}
