"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getClientSession, clearClientSession } from "@/lib/auth";
import { User, ClubEvent, EventRegistration, WaitlistEntry, Announcement, ContactMessage } from "@/lib/types";
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
  Inbox,
  Mail,
  Reply,
  ExternalLink,
  Eye,
  Clock,
  Building,
  Check,
  X,
  RefreshCw,
  Filter,
  UserPlus,
  UserCheck,
  Shield,
  UserMinus,
} from "lucide-react";

export default function ExecutivePortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Data states
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageFilter, setMessageFilter] = useState<"ALL" | "UNREAD" | "READ" | "REPLIED">("ALL");
  const [messageSearch, setMessageSearch] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<"ALL" | "EXECUTIVE" | "MEMBER">("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "MEMBER" as "MEMBER" | "EXECUTIVE",
    studentId: "",
    title: "Robotics Member",
    department: "Technology",
    password: "",
  });
  const [activeTab, setActiveTab] = useState<"EVENTS" | "WAITLIST" | "MESSAGES" | "ROSTER" | "TRANSMISSIONS" | "INVENTORY">("EVENTS");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pingingKeepAlive, setPingingKeepAlive] = useState(false);
  const [keepAliveStatus, setKeepAliveStatus] = useState<string | null>(null);

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
    coverColor: "from-[#00d6ff]/20 to-[#0050ff]/20",
    tags: ["Robotics"],
  });

  // New Announcement Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "ANNOUNCEMENT" as const,
  });

  const loadAllData = async () => {
    try {
      setLoadingMessages(true);
      const [evtRes, regRes, wtRes, annRes, msgRes, usrRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/register"),
        fetch("/api/waitlist"),
        fetch("/api/announcements"),
        fetch("/api/contact"),
        fetch("/api/users"),
      ]);

      const [evtJson, regJson, wtJson, annJson, msgJson, usrJson] = await Promise.all([
        evtRes.json(),
        regRes.json(),
        wtRes.json(),
        annRes.json(),
        msgRes.json(),
        usrRes.json(),
      ]);

      if (evtJson.success) setEvents(evtJson.events);
      if (regJson.success) setRegistrations(regJson.registrations);
      if (wtJson.success) setWaitlist(wtJson.waitlist);
      if (annJson.success) setAnnouncements(annJson.announcements);
      if (msgJson.success) setMessages(msgJson.messages);
      if (usrJson.success) setUsersList(usrJson.users);
    } catch (err) {
      console.error("Failed to load executive data", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const session = getClientSession();
    if (!session || session.role !== "EXECUTIVE") {
      router.push("/login");
      return;
    }
    setUser(session);
    loadAllData();
  }, [router]);


  const handleKeepAlivePulse = async () => {
    setPingingKeepAlive(true);
    try {
      const res = await fetch("/api/keepalive");
      const data = await res.json();
      if (data.success) {
        setKeepAliveStatus(`Awake (${data.latencyMs}ms)`);
        setTimeout(() => setKeepAliveStatus(null), 4000);
      } else {
        setKeepAliveStatus("Failed");
      }
    } catch {
      setKeepAliveStatus("Offline");
    } finally {
      setPingingKeepAlive(false);
    }
  };

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

  const handleUpdateMessageStatus = async (id: string, status: "UNREAD" | "READ" | "REPLIED") => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList([data.user, ...usersList]);
        setShowUserModal(false);
        setNewUser({
          name: "",
          email: "",
          role: "MEMBER",
          studentId: "",
          title: "Robotics Member",
          department: "Technology",
          password: "",
        });
        alert(`Account created successfully for ${data.user.name}!`);
      } else {
        alert(data.error || "Failed to create account");
      }
    } catch {
      alert("Error creating account");
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: "MEMBER" | "EXECUTIVE") => {
    const newRole = currentRole === "MEMBER" ? "EXECUTIVE" : "MEMBER";
    const newTitle = newRole === "EXECUTIVE" ? "Executive Officer" : "Robotics Member";
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole, title: newTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map((u) => (u.id === userId ? { ...u, role: newRole, title: newTitle } : u)));
      }
    } catch {
      alert("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke and delete this account?")) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.filter((u) => u.id !== userId));
      }
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleApproveWaitlistEntry = async (entry: WaitlistEntry) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entry.name,
          email: entry.email,
          studentId: entry.studentId,
          role: "MEMBER",
          title: `Member • ${entry.department} Dept`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList([data.user, ...usersList]);
        alert(`Account created for ${entry.name}! They can now log in at /login.`);
      } else {
        alert(data.error || "Failed to create member account");
      }
    } catch {
      alert("Error creating account from waitlist");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transmission?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const unreadMessagesCount = messages.filter((m) => m.status === "UNREAD").length;

  const filteredMessages = messages.filter((m) => {
    if (messageFilter !== "ALL" && m.status !== messageFilter) return false;
    if (messageSearch.trim()) {
      const query = messageSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.message.toLowerCase().includes(query) ||
        (m.affiliation && m.affiliation.toLowerCase().includes(query))
      );
    }
    return true;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d6ff]/40 bg-[#00d6ff]/15 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00d6ff] animate-pulse" />
              <span className="cyber-badge text-[#00d6ff]">EXECUTIVE COMMAND // ROOT ACCESS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white">
              Command <span className="text-[#00d6ff]">Center</span>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Active Events
            </span>
            <span className="text-3xl font-bold font-mono text-white">{events.length}</span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Passes Issued
            </span>
            <span className="text-3xl font-bold font-mono text-[#00d6ff]">
              {registrations.length}
            </span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Waitlist Inquiries
            </span>
            <span className="text-3xl font-bold font-mono text-white">
              {waitlist.length}
            </span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-[#C38EB4]/30 bg-[#C38EB4]/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-[#E1CBD7] uppercase block">
                Inbox Transmissions
              </span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#C38EB4] text-black font-bold animate-pulse">
                  {unreadMessagesCount} NEW
                </span>
              )}
            </div>
            <span className="text-3xl font-bold font-mono text-[#E1CBD7]">
              {messages.length}
            </span>
          </div>

          <div className="cyber-card p-5 rounded-2xl border border-white/10 col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              Broadcasts
            </span>
            <span className="text-3xl font-bold font-mono text-[#86A8CF]">
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
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
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
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Recruitment Waitlist ({waitlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("MESSAGES")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 relative ${
              activeTab === "MESSAGES"
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox Transmissions</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C38EB4] text-black font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("TRANSMISSIONS")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "TRANSMISSIONS"
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Transmissions Broadcast</span>
          </button>


          <button
            onClick={() => setActiveTab("ROSTER")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "ROSTER"
                ? "bg-[#00d6ff] text-black font-bold shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Club Roster &amp; Accounts ({usersList.length})</span>
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00d6ff] text-black font-mono font-bold text-xs uppercase hover:bg-[#38e1ff] transition-colors shadow-[0_0_15px_rgba(0,214,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>{showEventForm ? "Close Form" : "Create New Event"}</span>
              </button>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
              <form
                onSubmit={handleCreateEvent}
                className="cyber-card p-6 md:p-8 rounded-2xl border border-[#00d6ff]/30 space-y-4 text-xs font-mono"
              >
                <span className="cyber-badge text-[#00d6ff]">CREATE NEW EVENT</span>

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
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1B2A] border border-[#86A8CF]/20 text-white"
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
                  className="px-6 py-2.5 rounded-xl bg-[#00d6ff] hover:bg-[#38e1ff] text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(0,214,255,0.3)]"
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
                        <td className="py-3 px-3 font-bold text-[#00d6ff]">{reg.ticketCode}</td>
                        <td className="py-3 px-3 text-white font-medium">{reg.attendeeName}</td>
                        <td className="py-3 px-3 text-white/70 max-w-xs truncate">
                          {reg.eventTitle}
                        </td>
                        <td className="py-3 px-3 text-white/50">{reg.institution}</td>
                        <td className="py-3 px-3 text-white/50">{reg.phone}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#C38EB4]/10 text-[#E1CBD7] border border-[#C38EB4]/30 text-[10px]">
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
                <span className="cyber-badge text-[#00d6ff]">WAITLIST DATABASE</span>
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
                    <th className="py-2.5 px-3 text-right">ACTION</th>
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
                        <span className="px-2 py-0.5 rounded bg-[#00d6ff]/15 text-[#00d6ff] border border-[#00d6ff]/30 text-[10px]">
                          Pending Intake
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleApproveWaitlistEntry(item)}
                          className="px-2.5 py-1 rounded bg-[#00d6ff]/10 hover:bg-[#00d6ff]/20 text-[#00d6ff] border border-[#00d6ff]/30 text-[10px] font-mono transition-colors"
                        >
                          + Approve &amp; Create Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: INBOX CONTACT TRANSMISSIONS */}
        {activeTab === "MESSAGES" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="cyber-badge text-[#C38EB4]">OFFICIAL CONTACT TRANSMISSIONS</span>
                <h2 className="text-xl md:text-2xl font-bold uppercase text-white font-mono mt-1">
                  Transmissions Inbox ({messages.length})
                </h2>
                <p className="text-xs font-mono text-white/50">
                  Direct transmissions sent via /contact official form
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  disabled={loadingMessages}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white/80 transition-all"
                  title="Refresh Inquiries"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin text-[#00d6ff]" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="cyber-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/40 text-[11px] flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {(["ALL", "UNREAD", "READ", "REPLIED"] as const).map((filter) => {
                  const count =
                    filter === "ALL"
                      ? messages.length
                      : messages.filter((m) => m.status === filter).length;
                  const isActive = messageFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setMessageFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#00d6ff]/20 text-[#00d6ff] border-[#00d6ff]/50 font-bold"
                          : "bg-white/[0.02] text-white/60 border-white/5 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{filter}</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white/80">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sender, subject, body..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/40 focus:border-[#00d6ff]/50 outline-none text-xs"
                />
              </div>
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
              <div className="cyber-card p-12 text-center rounded-2xl border border-white/10 text-xs font-mono">
                <Inbox className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No transmissions found matching the selected filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((msg) => {
                  const isUnread = msg.status === "UNREAD";
                  const isReplied = msg.status === "REPLIED";
                  return (
                    <div
                      key={msg.id}
                      className={`cyber-card p-5 rounded-2xl border transition-all ${
                        isUnread
                          ? "border-[#C38EB4]/40 bg-[#C38EB4]/[0.03] shadow-[0_0_20px_rgba(195,142,180,0.08)]"
                          : "border-white/10 bg-white/[0.01] hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 font-mono">
                        <div className="space-y-2 flex-1">
                          {/* Status and Timestamp header */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                isUnread
                                  ? "bg-[#C38EB4]/20 text-[#E1CBD7] border-[#C38EB4]/40"
                                  : isReplied
                                  ? "bg-[#00d6ff]/15 text-[#00d6ff] border-[#00d6ff]/30"
                                  : "bg-white/10 text-white/60 border-white/15"
                              }`}
                            >
                              {msg.status}
                            </span>
                            <span className="text-white/40 text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.submittedAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {msg.affiliation && (
                              <span className="text-[#86A8CF] text-[11px] flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {msg.affiliation}
                              </span>
                            )}
                          </div>

                          {/* Sender and Subject */}
                          <div>
                            <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                              {msg.subject}
                            </h3>
                            <p className="text-xs text-[#00d6ff] mt-0.5">
                              From: <span className="text-white font-medium">{msg.name}</span> &lt;{msg.email}&gt;
                            </p>
                          </div>

                          {/* Excerpt */}
                          <p className="text-xs text-white/70 line-clamp-2 font-sans font-light leading-relaxed">
                            {msg.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center md:flex-col md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#00d6ff]/10 hover:bg-[#00d6ff]/20 border border-[#00d6ff]/30 text-[#00d6ff] text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read Transmission</span>
                          </button>

                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            onClick={() => {
                              if (msg.status === "UNREAD") {
                                handleUpdateMessageStatus(msg.id, "REPLIED");
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <Reply className="w-3.5 h-3.5 text-[#00d6ff]" />
                            <span>Reply via Email</span>
                          </a>

                          <div className="flex items-center gap-1.5 mt-1">
                            {msg.status !== "READ" && (
                              <button
                                onClick={() => handleUpdateMessageStatus(msg.id, "READ")}
                                className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                                title="Mark as Read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {msg.status === "READ" && (
                              <button
                                onClick={() => handleUpdateMessageStatus(msg.id, "UNREAD")}
                                className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                                title="Mark as Unread"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                              title="Delete Transmission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Read Transmission Modal */}
            {selectedMessage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="cyber-card p-6 md:p-8 rounded-3xl border border-[#00d6ff]/40 bg-[#0D1B2A] max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs font-mono shadow-[0_0_50px_rgba(0,214,255,0.15)] animate-in fade-in zoom-in-95 duration-200">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            selectedMessage.status === "UNREAD"
                              ? "bg-[#C38EB4]/20 text-[#E1CBD7] border-[#C38EB4]/40"
                              : selectedMessage.status === "REPLIED"
                              ? "bg-[#00d6ff]/15 text-[#00d6ff] border-[#00d6ff]/30"
                              : "bg-white/10 text-white/60 border-white/15"
                          }`}
                        >
                          {selectedMessage.status}
                        </span>
                        <span className="text-white/40 text-[11px]">
                          TRANSMISSION ID: {selectedMessage.id}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white uppercase font-mono">
                        {selectedMessage.subject}
                      </h2>
                    </div>

                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sender Metadata Box */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Sender</span>
                        <span className="text-white font-medium text-sm">{selectedMessage.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Email Address</span>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-[#00d6ff] hover:underline flex items-center gap-1"
                        >
                          <span>{selectedMessage.email}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {selectedMessage.affiliation && (
                        <div>
                          <span className="text-[10px] text-white/40 uppercase block">Institution / Club</span>
                          <span className="text-[#86A8CF]">{selectedMessage.affiliation}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Received At</span>
                        <span className="text-white/70">
                          {new Date(selectedMessage.submittedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block mb-2">
                      Transmission Body
                    </span>
                    <div className="p-5 rounded-2xl bg-[#040C16] border border-white/10 text-white/90 text-sm font-sans font-light leading-relaxed whitespace-pre-wrap selection:bg-[#00d6ff]/30">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[11px]">Set Status:</span>
                      <button
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, "UNREAD")}
                        className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                          selectedMessage.status === "UNREAD"
                            ? "bg-[#C38EB4] text-black font-bold border-[#C38EB4]"
                            : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white"
                        }`}
                      >
                        Unread
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, "READ")}
                        className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                          selectedMessage.status === "READ"
                            ? "bg-white text-black font-bold border-white"
                            : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white"
                        }`}
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, "REPLIED")}
                        className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                          selectedMessage.status === "REPLIED"
                            ? "bg-[#00d6ff] text-black font-bold border-[#00d6ff]"
                            : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white"
                        }`}
                      >
                        Replied
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors"
                      >
                        Delete
                      </button>

                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, "REPLIED")}
                        className="px-5 py-2 rounded-xl bg-[#00d6ff] hover:bg-[#38e1ff] text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Launch Email Reply</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        
        {/* TAB: CLUB ROSTER & ACCOUNTS */}
        {activeTab === "ROSTER" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="cyber-badge text-[#00d6ff]">USER &amp; IDENTITY MANAGEMENT</span>
                <h2 className="text-xl md:text-2xl font-bold uppercase text-white font-mono mt-1">
                  Club Roster &amp; Portal Accounts ({usersList.length})
                </h2>
                <p className="text-xs font-mono text-white/50">
                  Manage active member &amp; executive credentials stored in the Supabase cloud database
                </p>
              </div>

              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d6ff] hover:bg-[#38e1ff] text-black font-mono font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(0,214,255,0.3)] self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Provision New Account</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="cyber-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/40 text-[11px] flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {(["ALL", "EXECUTIVE", "MEMBER"] as const).map((filter) => {
                  const count =
                    filter === "ALL"
                      ? usersList.length
                      : usersList.filter((u) => u.role === filter).length;
                  const isActive = userRoleFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setUserRoleFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#00d6ff]/20 text-[#00d6ff] border-[#00d6ff]/50 font-bold"
                          : "bg-white/[0.02] text-white/60 border-white/5 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{filter}</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white/80">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, student ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/40 focus:border-[#00d6ff]/50 outline-none text-xs"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="cyber-card p-6 rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px]">
                      <th className="py-2.5 px-3">MEMBER</th>
                      <th className="py-2.5 px-3">EMAIL</th>
                      <th className="py-2.5 px-3">STUDENT ID</th>
                      <th className="py-2.5 px-3">TITLE / ROLE</th>
                      <th className="py-2.5 px-3">ROLE BADGE</th>
                      <th className="py-2.5 px-3 text-right">MANAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList
                      .filter((u) => {
                        if (userRoleFilter !== "ALL" && u.role !== userRoleFilter) return false;
                        if (userSearch.trim()) {
                          const q = userSearch.toLowerCase();
                          return (
                            u.name.toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q) ||
                            u.studentId.toLowerCase().includes(q) ||
                            u.title.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                {u.avatar && u.avatar.startsWith("/") ? (
                                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                  u.name.charAt(0)
                                )}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#00d6ff]">{u.email}</td>
                          <td className="py-3 px-3 text-white/60">{u.studentId}</td>
                          <td className="py-3 px-3 text-white/70">{u.title}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                u.role === "EXECUTIVE"
                                  ? "bg-[#00d6ff]/15 text-[#00d6ff] border-[#00d6ff]/40"
                                  : "bg-[#86A8CF]/15 text-[#86A8CF] border-[#86A8CF]/30"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleUserRole(u.id, u.role)}
                                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 text-[10px] transition-colors"
                                title={u.role === "MEMBER" ? "Promote to Executive" : "Demote to Member"}
                              >
                                {u.role === "MEMBER" ? "Promote Exec" : "Demote Member"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Provision New Account Modal */}
            {showUserModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="cyber-card p-6 md:p-8 rounded-3xl border border-[#00d6ff]/40 bg-[#0D1B2A] max-w-lg w-full space-y-4 text-xs font-mono shadow-[0_0_50px_rgba(0,214,255,0.15)] animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="cyber-badge text-[#00d6ff]">PROVISION USER</span>
                      <h3 className="text-base font-bold text-white uppercase mt-0.5">
                        Add Portal Account
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-3">
                    <div>
                      <label className="block text-white/60 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/60 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="tanvir@mrc.club"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1">Student ID *</label>
                        <input
                          type="text"
                          required
                          placeholder="MRC-2026-055"
                          value={newUser.studentId}
                          onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/60 mb-1">Portal Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              role: e.target.value as "MEMBER" | "EXECUTIVE",
                              title: e.target.value === "EXECUTIVE" ? "Executive Officer" : "Robotics Member",
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#070E1A] border border-white/10 text-white"
                        >
                          <option value="MEMBER">Member (Workspace Access)</option>
                          <option value="EXECUTIVE">Executive (Root Access)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1">Title / Designation</label>
                        <input
                          type="text"
                          placeholder="e.g. Firmware Specialist"
                          value={newUser.title}
                          onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/60 mb-1">Password (Optional)</label>
                      <input
                        type="password"
                        placeholder="Leave blank for demo / passwordless"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#00d6ff] hover:bg-[#38e1ff] text-black font-bold uppercase text-xs transition-all shadow-[0_0_15px_rgba(0,214,255,0.3)]"
                      >
                        Save Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
                <Radio className="w-4 h-4 text-[#E1CBD7]" />
                <span className="cyber-badge text-[#E1CBD7]">BROADCAST NEW TRANSMISSION</span>
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
                className="px-6 py-2.5 rounded-xl bg-[#C38EB4] hover:bg-[#E1CBD7] text-black font-bold uppercase transition-colors"
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
          <div className="cyber-card p-8 md:p-12 rounded-3xl border border-[#00d6ff]/30 bg-gradient-to-br from-[#142032] to-[#070E1A]">
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
                <span className="text-white block font-bold mb-1">01. CONTROLLERS &amp; BOARDS</span>
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
                <span className="text-[#E1CBD7] block font-bold mb-1">03. SENSOR ARRAYS &amp; BATTERIES</span>
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

      <footer className="border-t border-[#86A8CF]/15 bg-[#040C16] py-6 text-center text-xs font-mono text-white/40">
        <p>© {new Date().getFullYear()} Manarat Robotics Club. Executive Portal.</p>
      </footer>
    </div>
  );
}
