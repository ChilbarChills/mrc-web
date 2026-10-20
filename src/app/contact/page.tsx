"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Globe,
  Share2,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    affiliation: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to transmit message");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        affiliation: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span className="cyber-badge text-[#00d6ff]">CONTACT &amp; HEADQUARTERS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Get in <span className="text-[#00d6ff]">Touch</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            Have questions about our upcoming robotics workshops, collegiate tournaments, or club sponsorships? Connect directly with the Manarat Robotics Club executive team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#00d6ff]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00d6ff]/10 border border-[#00d6ff]/30 flex items-center justify-center text-[#00d6ff] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-1">
                    CAMPUS HEADQUARTERS
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">School Address</h3>
                  <p className="text-xs md:text-sm font-mono text-[#86A8CF] leading-relaxed">
                    H.No 16, Road No. 104, QCRC+97G, Rd 104, Dhaka 1212
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Manarat Dhaka International School &amp; College, Gulshan-2, Dhaka
                  </p>
                  <a
                    href="https://maps.google.com/?q=H.No+16,+Road+No.+104,+Dhaka+1212"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00d6ff] mt-4 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#00d6ff]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0050ff]/15 border border-[#0050ff]/30 flex items-center justify-center text-[#00d6ff] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-1">
                    ELECTRONIC DISPATCH
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">Club Email</h3>
                  <div className="space-y-1">
                    <a
                      href="mailto:contact@manaratrobotics.club"
                      className="text-xs md:text-sm font-mono text-white hover:text-[#00d6ff] transition-colors block"
                    >
                      contact@manaratrobotics.club
                    </a>
                    <a
                      href="mailto:executive@mrc.club"
                      className="text-xs font-mono text-white/50 hover:text-[#00d6ff] transition-colors block"
                    >
                      executive@mrc.club
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours / Schedule */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C38EB4]/15 border border-[#C38EB4]/30 flex items-center justify-center text-[#C38EB4] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-1">
                    LAB ACCESS HOURS
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1">Thursday Hands-On Sessions</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    Thursday after school from 12:20pm to 1:20pm in Physics and Chemistry LAB.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-[#00d6ff]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Official Social Channels
                </h3>
              </div>
              <p className="text-xs text-white/50 mb-4">
                Follow our build logs, tournament photos, and event broadcasts:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <a
                  href="https://www.instagram.com/manaratrobotics/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#C38EB4]/50 hover:bg-[#C38EB4]/10 transition-all flex items-center justify-between group"
                >
                  <span className="text-white/80 group-hover:text-white font-semibold">Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C38EB4]" />
                </a>
                <a
                  href="https://discord.gg/8HJ6JQK5ev"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#00d6ff]/50 hover:bg-[#00d6ff]/10 transition-all flex items-center justify-between group"
                >
                  <span className="text-white/80 group-hover:text-white font-semibold">Discord</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00d6ff]" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Google Maps Embed & Interactive Message Box */}
          <div className="lg:col-span-7 space-y-6">
            {/* Google Map Card */}
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00d6ff]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                    Interactive Satellite Radar // Campus Map
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#00d6ff] bg-[#00d6ff]/10 px-2 py-0.5 rounded border border-[#00d6ff]/20">
                  DHAKA 1212
                </span>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-[#86A8CF]/20 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <iframe
                  title="Manarat Robotics Club Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=H.No%2016%2C%20Road%20No.%20104%2C%20Dhaka%201212&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full filter invert-[0.92] hue-rotate-[180deg] contrast-[1.15]"
                />
              </div>
              <p className="text-[11px] font-mono text-white/40 mt-3">
                * Coordinate Pin: H.No 16, Road No. 104, QCRC+97G, Rd 104, Dhaka 1212
              </p>
            </div>

            {/* Quick Message Form */}
            <div className="cyber-card p-6 md:p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold uppercase text-white font-mono mb-2">
                Send an Official Transmission
              </h3>
              <p className="text-xs text-white/60 mb-6">
                Our executive committee monitors messages daily and responds within 24 hours.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#00d6ff]/10 border border-[#00d6ff]/30 text-[#00d6ff] font-mono text-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <div>
                      <span className="font-bold block text-white">Transmission Received!</span>
                      <span className="text-xs text-white/70">
                        Your message has been securely delivered to the MRC Executive Command Center. An officer will review and reply to your email shortly.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                      {errorMessage}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abrar Fahim"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. abrar@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1">School / Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. Manarat Dhaka International School"
                        value={formData.affiliation}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Robofest Tournament Query"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your inquiry or partnership proposal here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-[#00d6ff] hover:bg-[#38e1ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,214,255,0.3)] disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Transmitting..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Communications Hub.</p>
      </footer>
    </div>
  );
}
