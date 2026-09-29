"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getClientSession, clearClientSession } from "@/lib/auth";
import { User, ClubEvent, EventRegistration, WaitlistEntry, Announcement } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Calendar,
  Users,
  Bell,
  Cpu,
  Plus,
  Trash2,
  Ticket,
  LogOut,
  Radio,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

export default function ExecutivePortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Data states
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<"EVENTS" | "WAITLIST" | "TRANSMISSIONS" | "INVENTORY">("EVENTS");

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    slug: "",
    category: "COMPETITION" as const,
    date: "",
    time: "",
    venue: "",
    shortDesc: "",
    description: "",
    maxCapacity: 50,
    status: "REGISTRATION_OPEN" as const,
    coverColor: "from-[#ff6b35]/20 to-[#0050ff]/20",
    tags: ["Robotics"],
  });

  // New Announcement Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "ANNOUNCEMENT" as const,
  });

  useEffect(() => {
    const session = getClientSession();
    if (!session || session.role !== "EXECUTIVE") {
      router.push("/login");
      return;
    }
    setUser(session);

    async function loadAllData() {
      try {
        const [evtRes, regRes, wtRes, annRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/register"),
          fetch("/api/waitlist"),
          fetch("/api/announcements"),
        ]);

        const [evtJson, regJson, wtJson, annJson] = await Promise.all([
          evtRes.json(),
          regRes.json(),
          wtRes.json(),
          annRes.json(),
        ]);

        if (evtJson.success) setEvents(evtJson.events);
        if (regJson.success) setRegistrations(regJson.registrations);
        if (wtJson.success) setWaitlist(wtJson.waitlist);
        if (annJson.success) setAnnouncements(annJson.announcements);
      } catch (err) {
        console.error("Failed to load executive data", err);
      }
    }
    loadAllData();
  }, [router]);

  const handleLogout = () => {
    clearClientSession();
    router.push("/");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEvent,
          slug: newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents([data.event, ...events]);
        setShowEventForm(false);
        alert("New event created successfully and live on public site!");
      }
    } catch {
      alert("Failed to create event");
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAnnouncement,
          author: user?.name || "Executive Committee",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements([data.announcement, ...announcements]);
        setNewAnnouncement({ title: "", content: "", category: "ANNOUNCEMENT" });
        alert("Transmission broadcasted live to public page!");
      }
    } catch {
      alert("Failed to broadcast transmission");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff6b35]/40 bg-[#ff6b35]/15 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
              <span className="cyber-badge text-[#ff6b35]">EXECUTIVE COMMAND // ROOT ACCESS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white">
              Command <span className="text-[#ff6b35]">Center</span>
            </h1>
            <p className="text-xs font-mono text-white/50 mt-1">
              Logged in as {user.name} ({user.title}) • Database Active
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

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Total Active Events
            </span>
            <span className="text-3xl font-bold font-mono text-white">{events.length}</span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Attendee Passes Issued
            </span>
            <span className="text-3xl font-bold font-mono text-[#00d6ff]">
              {registrations.length}
            </span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Waitlist Inquiries
            </span>
            <span className="text-3xl font-bold font-mono text-[#ff6b35]">
              {waitlist.length}
            </span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Transmissions Live
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {announcements.length}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("EVENTS")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "EVENTS"
                ? "bg-[#ff6b35] text-black font-bold shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events &amp; Registrations</span>
          </button>

          <button
            onClick={() => setActiveTab("WAITLIST")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "WAITLIST"
                ? "bg-[#ff6b35] text-black font-bold shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Recruitment Waitlist ({waitlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("TRANSMISSIONS")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "TRANSMISSIONS"
                ? "bg-[#ff6b35] text-black font-bold shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Transmissions Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab("INVENTORY")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "INVENTORY"
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#00d6ff]" />
            <span>Hardware Inventory (Future Task)</span>
          </button>
        </div>

        {/* TAB 1: EVENTS & REGISTRATIONS */}
        {activeTab === "EVENTS" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase text-white font-mono">
                Current Events ({events.length})
              </h2>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b35] text-black font-mono font-bold text-xs uppercase hover:bg-[#ff8252] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{showEventForm ? "Close Form" : "Create New Event"}</span>
              </button>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
              <form
                onSubmit={handleCreateEvent}
                className="cyber-card p-6 md:p-8 rounded-2xl border border-[#ff6b35]/30 space-y-4 text-xs font-mono"
              >
                <span className="cyber-badge text-[#ff6b35]">CREATE NEW EVENT</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RoboCombat Clash 2026"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1017] border border-white/10 text-white"
                    >
                      <option value="COMPETITION">Competition</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="SEMINAR">Seminar</option>
                      <option value="HACKATHON">Hackathon</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM - 04:00 PM"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Max Capacity</label>
                    <input
                      type="number"
                      value={newEvent.maxCapacity}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, maxCapacity: parseInt(e.target.value) || 50 })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Indoor Arena / Room 402"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Short Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief 1-sentence synopsis"
                    value={newEvent.shortDesc}
                    onChange={(e) => setNewEvent({ ...newEvent, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Full Details</label>
                  <textarea
                    rows={3}
                    placeholder="Full description and rules"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-black font-bold uppercase"
                >
                  Publish Event Immediately
                </button>
              </form>
            )}

            {/* Registered Attendees Roster Table */}
            <div className="cyber-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#00d6ff]" />
                  <h3 className="text-sm font-bold uppercase font-mono text-white">
                    Confirmed Attendee Passes ({registrations.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/40">
                  REAL-TIME DATABASE SYNC
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px]">
                      <th className="py-2.5 px-3">TICKET CODE</th>
                      <th className="py-2.5 px-3">ATTENDEE</th>
                      <th className="py-2.5 px-3">EVENT</th>
                      <th className="py-2.5 px-3">INSTITUTION</th>
                      <th className="py-2.5 px-3">PHONE</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-bold text-[#ff6b35]">{reg.ticketCode}</td>
                        <td className="py-3 px-3 text-white font-medium">{reg.attendeeName}</td>
                        <td className="py-3 px-3 text-white/70 max-w-xs truncate">
                          {reg.eventTitle}
                        </td>
                        <td className="py-3 px-3 text-white/50">{reg.institution}</td>
                        <td className="py-3 px-3 text-white/50">{reg.phone}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITMENT WAITLIST */}
        {activeTab === "WAITLIST" && (
          <div className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="cyber-badge text-[#ff6b35]">WAITLIST DATABASE</span>
                <h3 className="text-xl font-bold uppercase text-white mt-1">
                  Prospective Member Inquiries ({waitlist.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-white/40">
                Generated from "Opening Soon" Portal
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[10px]">
                    <th className="py-2.5 px-3">STUDENT NAME</th>
                    <th className="py-2.5 px-3">EMAIL</th>
                    <th className="py-2.5 px-3">STUDENT ID</th>
                    <th className="py-2.5 px-3">DEPARTMENT</th>
                    <th className="py-2.5 px-3">INTERESTS</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-white font-medium">{item.name}</td>
                      <td className="py-3 px-3 text-[#00d6ff]">{item.email}</td>
                      <td className="py-3 px-3 text-white/60">{item.studentId}</td>
                      <td className="py-3 px-3 text-white/60">{item.department}</td>
                      <td className="py-3 px-3 text-white/40">
                        {Array.isArray(item.interests) ? item.interests.join(", ") : "Robotics"}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#ff6b35]/15 text-[#ff6b35] text-[10px]">
                          Pending Intake
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSMISSIONS BROADCAST */}
        {activeTab === "TRANSMISSIONS" && (
          <div className="space-y-8">
            <form
              onSubmit={handleCreateAnnouncement}
              className="cyber-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="cyber-badge text-emerald-400">BROADCAST NEW TRANSMISSION</span>
              </div>

              <div>
                <label className="block text-white/60 mb-1">Headline / Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LFR Arena Track Setup Starting Thursday"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Transmission Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official notice content visible on homepage..."
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase transition-colors"
              >
                Broadcast to Live Feed
              </button>
            </form>

            <div className="cyber-card p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold uppercase font-mono text-white mb-4">
                Active Transmissions ({announcements.length})
              </h3>
              <div className="space-y-3 text-xs font-mono">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#00d6ff]">{ann.publishedAt}</span>
                      <h4 className="text-white font-bold mt-0.5">{ann.title}</h4>
                      <p className="text-white/60 text-[11px] mt-1">{ann.content}</p>
                    </div>
                    <span className="text-[10px] text-white/30">By {ann.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HARDWARE INVENTORY TRACKER (FUTURE TASK ROADMAP AS PLANNED) */}
        {activeTab === "INVENTORY" && (
          <div className="cyber-card p-8 md:p-12 rounded-3xl border border-[#00d6ff]/30 bg-gradient-to-br from-[#0c121e] to-[#07080d]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/40 bg-[#00d6ff]/15 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00d6ff]" />
              <span className="cyber-badge text-[#00d6ff]">FUTURE ROADMAP // PHASE 2</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-3">
              Hardware &amp; Component Inventory Tracking
            </h2>

            <p className="text-xs md:text-sm text-white/70 max-w-2xl leading-relaxed mb-8 font-light">
              As designated in the project plan, the dedicated hardware asset tracking module is scheduled for Phase 2 deployment. This system will maintain digital records of microcontrollers, sensors, motors, and club tools.
            </p>

            {/* Architecture Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mb-8">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#ff6b35] block font-bold mb-1">01. CONTROLLERS &amp; BOARDS</span>
                <p className="text-white/50 text-[11px]">
                  Tracking 15x STM32F4 BlackPills, 20x ESP32-S3 DevKits, 12x Arduino Unos, and 4x Raspberry Pi 5 units.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#00d6ff] block font-bold mb-1">02. ACTUATORS &amp; MOTORS</span>
                <p className="text-white/50 text-[11px]">
                  Tracking Coreless 12V 25,000 RPM motors, planetary gearboxes, and 3x 58mm Omni-wheels.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-emerald-400 block font-bold mb-1">03. SENSOR ARRAYS &amp; BATTERIES</span>
                <p className="text-white/50 text-[11px]">
                  Tracking QTR-8A Reflectance arrays, LiDAR-Lite v3, and 3S 1300mAh LiPo battery health logs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#00d6ff]/5 border border-[#00d6ff]/20 text-[11px] font-mono text-[#00d6ff] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Inventory schema and database adapters are already pre-configured in lib/db.ts ready for Phase 2 activation.
              </span>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 bg-[#040406] py-6 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Executive Portal.</p>
      </footer>
    </div>
  );
}
