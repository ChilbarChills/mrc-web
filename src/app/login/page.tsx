"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { setClientSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ShieldAlert, UserCheck, Key, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // Save user session in localStorage
      setClientSession(data.user);

      // Route to destination
      router.push(data.redirectTo);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide an email");
      return;
    }
    handleLogin(email);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="cyber-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden bg-gradient-to-b from-[#0f111a] to-[#07080c]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d6ff]/5 blur-[80px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0050ff] to-[#00d6ff] p-[1px] mx-auto mb-4">
              <div className="w-full h-full bg-[#050508] rounded-[11px] flex items-center justify-center font-mono font-bold text-white text-base">
                M
              </div>
            </div>
            <span className="cyber-badge text-[#00d6ff]">PORTAL AUTHENTICATION</span>
            <h1 className="text-2xl font-black uppercase text-white mt-1">MRC Access Gateway</h1>
            <p className="text-xs text-white/50 mt-1">
              Sign in to access Member tools or Executive records
            </p>
          </div>

          {/* Quick Demo 1-Click Buttons */}
          <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
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

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0b0d14] px-3 text-[10px] font-mono text-white/40 uppercase tracking-widest absolute">
              or enter credentials
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-white/60 mb-1.5 uppercase">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="executive@mrc.club or member@mrc.club"
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

          <div className="mt-6 text-center text-xs font-mono text-white/40">
            <span>Not a member yet? </span>
            <Link href="/join" className="text-[#00d6ff] hover:underline">
              Join Recruitment Waitlist
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-6 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Unified Auth Service.</p>
      </footer>
    </div>
  );
}
