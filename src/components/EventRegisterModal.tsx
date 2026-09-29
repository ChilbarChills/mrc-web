"use client";

import { useState } from "react";
import { ClubEvent, EventRegistration } from "@/lib/types";
import { X, CheckCircle2, Ticket, Calendar, MapPin, User, Mail, Phone, Building2 } from "lucide-react";

interface EventRegisterModalProps {
  event: ClubEvent;
  onClose: () => void;
  onSuccess?: (registration: EventRegistration) => void;
}

export default function EventRegisterModal({ event, onClose, onSuccess }: EventRegisterModalProps) {
  const [formData, setFormData] = useState({
    attendeeName: "",
    email: "",
    phone: "",
    institution: "",
    teamName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedReg, setConfirmedReg] = useState<EventRegistration | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Registration failed");
      } else {
        setConfirmedReg(data.registration);
        if (onSuccess) onSuccess(data.registration);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg cyber-card p-6 md:p-8 rounded-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedReg ? (
          /* Confirmation Ticket Card */
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="cyber-badge text-emerald-400">REGISTRATION CONFIRMED</span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-2">You're on the Roster!</h3>
            <p className="text-xs text-white/60 mb-6">
              Keep your ticket code handy for verification at the event venue.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6 text-left space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-white/40">TICKET PASS</span>
                <span className="text-sm font-mono font-bold text-[#ff6b35] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  {confirmedReg.ticketCode}
                </span>
              </div>
              <div className="text-xs text-white/80">
                <span className="text-white/40 block text-[10px]">EVENT</span>
                {confirmedReg.eventTitle}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-white/40 block text-[10px]">ATTENDEE</span>
                  {confirmedReg.attendeeName}
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">INSTITUTION</span>
                  {confirmedReg.institution}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#00d6ff] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#33deff] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div className="mb-6">
              <span className="cyber-badge text-[#ff6b35]">EVENT REGISTRATION</span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-1 leading-tight">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00d6ff]" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6b35]" />
                  {event.venue}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-white/60 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayman Rahman"
                    value={formData.attendeeName}
                    onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1.5 uppercase tracking-wider">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-1.5 uppercase tracking-wider">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="tel"
                      required
                      placeholder="+8801..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 uppercase tracking-wider">
                  College / Institution
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="e.g. Manarat Dhaka International School & College"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              </div>

              {event.category === "COMPETITION" && (
                <div>
                  <label className="block text-white/60 mb-1.5 uppercase tracking-wider">
                    Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CyberVanguard"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#ff6b35] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ff804d] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,107,53,0.3)]"
                >
                  {loading ? "Processing Pass..." : "Confirm Free Registration"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
