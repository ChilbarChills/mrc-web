"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EventRegisterModal from "@/components/EventRegisterModal";
import Link from "next/link";
import { ClubEvent } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  Cpu,
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventForModal, setSelectedEventForModal] = useState<ClubEvent | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) setEvents(data.events);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesCategory =
      selectedCategory === "ALL" || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/30 bg-[#00d6ff]/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00d6ff]" />
            <span className="cyber-badge text-[#00d6ff]">FIELD OPERATIONS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Events &amp; <span className="text-[#00d6ff]">Competitions</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            From regional line follower championships to deep-dive embedded hardware workshops. Reserve your visitor or participant pass.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {["ALL", "COMPETITION", "WORKSHOP", "SEMINAR"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === cat
                    ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                    : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00d6ff]"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="cyber-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-[#00d6ff]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded-md font-bold tracking-wider ${
                      event.category === "COMPETITION"
                        ? "bg-[#0050ff]/25 text-white border border-[#0050ff]/40"
                        : "bg-[#00d6ff]/20 text-[#00d6ff] border border-[#00d6ff]/30"
                    }`}
                  >
                    {event.category}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    {event.registeredCount}/{event.maxCapacity} SLOTS
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00d6ff] transition-colors leading-tight">
                  {event.title}
                </h3>

                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 text-xs font-mono text-white/50 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#00d6ff]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-white/30" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00d6ff]" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-white/40 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedEventForModal(event)}
                className="w-full py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold bg-white/[0.05] border border-white/10 hover:bg-[#00d6ff] hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2"
              >
                <span>Register Attendee Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-sm font-mono text-white/40">No events found matching your filter.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedEventForModal && (
        <EventRegisterModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040406] py-8 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Events Management System.</p>
      </footer>
    </div>
  );
}
