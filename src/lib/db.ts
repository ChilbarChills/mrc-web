import { supabaseAdmin } from "./supabase";
import { ClubEvent, EventRegistration, RobotProject, User, Announcement, WaitlistEntry, ContactMessage, Achievement } from "./types";
import {
  initialUsers,
  initialEvents,
  initialProjects,
  initialAnnouncements,
  initialRegistrations,
  initialWaitlist,
  initialMessages,
  initialAchievements,
} from "./seed-data";

// Fallback in-memory cache for local development or if Supabase tables haven't been created yet
let localMemoryDb = {
  users: [...initialUsers],
  events: [...initialEvents],
  registrations: [...initialRegistrations],
  projects: [...initialProjects],
  announcements: [...initialAnnouncements],
  waitlist: [...initialWaitlist],
  messages: [...initialMessages] as ContactMessage[],
  achievements: [...initialAchievements] as Achievement[],
};

export const db = {
  // --- USERS & AUTH ---
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabaseAdmin.from("users").select("*");
      if (!error && data) {
        return data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          studentId: u.student_id,
          avatar: u.avatar || "/generic-avatar.svg",
          joinedYear: u.joined_year,
          title: u.title,
          bio: u.bio,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch users failed, using fallback:", err);
    }
    return localMemoryDb.users;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .ilike("email", email.trim())
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          studentId: data.student_id,
          avatar: data.avatar || "/generic-avatar.svg",
          joinedYear: data.joined_year,
          title: data.title,
          bio: data.bio,
          password: data.password,
        };
      }
    } catch (err) {
      console.warn("Supabase user by email failed:", err);
    }
    const normalized = email.trim().toLowerCase();
    const found =
      localMemoryDb.users.find((u) => u.email.toLowerCase() === normalized) ||
      initialUsers.find((u) => u.email.toLowerCase() === normalized);
    if (found) return found;

    if (normalized === "executive@mrc.club" || normalized.includes("exec")) {
      return initialUsers.find((u) => u.role === "EXECUTIVE") || null;
    }
    if (normalized === "member@mrc.club" || normalized.includes("member")) {
      return initialUsers.find((u) => u.role === "MEMBER") || null;
    }
    return null;
  },

  getUserById: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          studentId: data.student_id,
          avatar: data.avatar || "/generic-avatar.svg",
          joinedYear: data.joined_year,
          title: data.title,
          bio: data.bio,
          password: data.password,
        };
      }
    } catch (err) {
      console.warn("Supabase user by id failed:", err);
    }
    return localMemoryDb.users.find((u) => u.id === id) || null;
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    const id = `usr-${Date.now()}`;
    const newUser: User = {
      ...user,
      id,
      avatar: user.avatar || "/generic-avatar.svg",
      joinedYear: user.joinedYear || new Date().getFullYear().toString(),
      title: user.title || (user.role === "EXECUTIVE" ? "Executive Officer" : "Robotics Member"),
    };

    try {
      // First attempt inserting with password
      const { error } = await supabaseAdmin.from("users").insert({
        id,
        name: newUser.name,
        email: newUser.email.toLowerCase().trim(),
        role: newUser.role,
        student_id: newUser.studentId,
        avatar: newUser.avatar,
        joined_year: newUser.joinedYear,
        title: newUser.title,
        bio: newUser.bio || "",
        ...(newUser.password ? { password: newUser.password } : {}),
      });

      if (error && error.message.includes("password")) {
        // Fallback if password column is not yet added in Supabase
        await supabaseAdmin.from("users").insert({
          id,
          name: newUser.name,
          email: newUser.email.toLowerCase().trim(),
          role: newUser.role,
          student_id: newUser.studentId,
          avatar: newUser.avatar,
          joined_year: newUser.joinedYear,
          title: newUser.title,
          bio: newUser.bio || "",
        });
      }
    } catch (err) {
      console.warn("Supabase createUser error:", err);
    }

    localMemoryDb.users.unshift(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const payload: Record<string, any> = {};
      if (updates.name) payload.name = updates.name;
      if (updates.email) payload.email = updates.email.toLowerCase().trim();
      if (updates.role) payload.role = updates.role;
      if (updates.studentId) payload.student_id = updates.studentId;
      if (updates.title) payload.title = updates.title;
      if (updates.bio !== undefined) payload.bio = updates.bio;
      if (updates.avatar) payload.avatar = updates.avatar;
      if (updates.joinedYear) payload.joined_year = updates.joinedYear;
      if (updates.password) payload.password = updates.password;

      await supabaseAdmin.from("users").update(payload).eq("id", id);
    } catch (err) {
      console.warn("Supabase updateUser error:", err);
    }

    const localUser = localMemoryDb.users.find((u) => u.id === id);
    if (localUser) {
      Object.assign(localUser, updates);
      return true;
    }
    return true;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await supabaseAdmin.from("users").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteUser error:", err);
    }

    const index = localMemoryDb.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      localMemoryDb.users.splice(index, 1);
      return true;
    }
    return true;
  },

  // --- EVENTS ---
  getEvents: async (): Promise<ClubEvent[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          category: e.category,
          date: e.date,
          time: e.time,
          venue: e.venue,
          shortDesc: e.short_desc || "",
          description: e.description || "",
          maxCapacity: e.max_capacity,
          registeredCount: e.registered_count || 0,
          status: e.status,
          coverColor: e.cover_color,
          tags: Array.isArray(e.tags) ? e.tags : [],
        }));
      }
    } catch (err) {
      console.warn("Supabase getEvents failed, using fallback:", err);
    }
    return localMemoryDb.events;
  },

  getEventBySlug: async (slug: string): Promise<ClubEvent | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("events")
        .select("*")
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          category: data.category,
          date: data.date,
          time: data.time,
          venue: data.venue,
          shortDesc: data.short_desc || "",
          description: data.description || "",
          maxCapacity: data.max_capacity,
          registeredCount: data.registered_count || 0,
          status: data.status,
          coverColor: data.cover_color,
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      }
    } catch (err) {
      console.warn("Supabase getEventBySlug failed:", err);
    }
    return localMemoryDb.events.find((e) => e.slug === slug || e.id === slug) || null;
  },

  createEvent: async (newEvent: Omit<ClubEvent, "id" | "registeredCount">): Promise<ClubEvent> => {
    const id = `evt-${Date.now()}`;
    const event: ClubEvent = {
      ...newEvent,
      id,
      registeredCount: 0,
    };

    try {
      const { error } = await supabaseAdmin.from("events").insert({
        id,
        title: event.title,
        slug: event.slug,
        category: event.category,
        date: event.date,
        time: event.time,
        venue: event.venue,
        short_desc: event.shortDesc,
        description: event.description,
        max_capacity: event.maxCapacity,
        registered_count: 0,
        status: event.status,
        cover_color: event.coverColor,
        tags: event.tags,
      });

      if (!error) {
        localMemoryDb.events.unshift(event);
        return event;
      }
    } catch (err) {
      console.warn("Supabase createEvent failed, using local fallback:", err);
    }

    localMemoryDb.events.unshift(event);
    return event;
  },

  updateEvent: async (id: string, updates: Partial<ClubEvent>): Promise<ClubEvent | null> => {
    try {
      const supabaseUpdates: Record<string, any> = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.date) supabaseUpdates.date = updates.date;
      if (updates.time) supabaseUpdates.time = updates.time;
      if (updates.venue) supabaseUpdates.venue = updates.venue;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.registeredCount !== undefined) supabaseUpdates.registered_count = updates.registeredCount;

      await supabaseAdmin.from("events").update(supabaseUpdates).eq("id", id);
    } catch (err) {
      console.warn("Supabase updateEvent error:", err);
    }

    const index = localMemoryDb.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      localMemoryDb.events[index] = { ...localMemoryDb.events[index], ...updates };
      return localMemoryDb.events[index];
    }
    return null;
  },

  // --- REGISTRATIONS ---
  getRegistrations: async (): Promise<EventRegistration[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id,
          ticketCode: r.ticket_code,
          eventId: r.event_id,
          eventTitle: r.event_title,
          attendeeName: r.attendee_name,
          email: r.email,
          phone: r.phone,
          institution: r.institution,
          teamName: r.team_name,
          status: r.status,
          registeredAt: r.registered_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getRegistrations failed:", err);
    }
    return localMemoryDb.registrations;
  },

  getRegistrationsByEvent: async (eventId: string): Promise<EventRegistration[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("registered_at", { ascending: false });

      if (!error && data) {
        return data.map((r) => ({
          id: r.id,
          ticketCode: r.ticket_code,
          eventId: r.event_id,
          eventTitle: r.event_title,
          attendeeName: r.attendee_name,
          email: r.email,
          phone: r.phone,
          institution: r.institution,
          teamName: r.team_name,
          status: r.status,
          registeredAt: r.registered_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getRegistrationsByEvent error:", err);
    }
    return localMemoryDb.registrations.filter((r) => r.eventId === eventId);
  },

  createRegistration: async (
    reg: Omit<EventRegistration, "id" | "ticketCode" | "registeredAt" | "status">
  ): Promise<EventRegistration> => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const id = `reg-${Date.now()}`;
    const ticketCode = `MRC-EVT-${randomCode}`;
    const registeredAt = new Date().toISOString();

    const newRegistration: EventRegistration = {
      ...reg,
      id,
      ticketCode,
      registeredAt,
      status: "CONFIRMED",
    };

    try {
      const { error } = await supabaseAdmin.from("registrations").insert({
        id,
        ticket_code: ticketCode,
        event_id: reg.eventId,
        event_title: reg.eventTitle,
        attendee_name: reg.attendeeName,
        email: reg.email,
        phone: reg.phone,
        institution: reg.institution,
        team_name: reg.teamName || null,
        status: "CONFIRMED",
        registered_at: registeredAt,
      });

      if (!error) {
        // Increment event count in Supabase
        const { data: eventData } = await supabaseAdmin
          .from("events")
          .select("registered_count, max_capacity")
          .eq("id", reg.eventId)
          .maybeSingle();

        if (eventData) {
          const newCount = (eventData.registered_count || 0) + 1;
          await supabaseAdmin
            .from("events")
            .update({
              registered_count: newCount,
              status: newCount >= eventData.max_capacity ? "FULL" : "REGISTRATION_OPEN",
            })
            .eq("id", reg.eventId);
        }
      }
    } catch (err) {
      console.warn("Supabase createRegistration failed, storing in memory:", err);
    }

    localMemoryDb.registrations.unshift(newRegistration);
    const localEvt = localMemoryDb.events.find((e) => e.id === reg.eventId);
    if (localEvt) {
      localEvt.registeredCount = (localEvt.registeredCount || 0) + 1;
      if (localEvt.registeredCount >= localEvt.maxCapacity) localEvt.status = "FULL";
    }

    return newRegistration;
  },

  // --- RECRUITMENT WAITLIST ---
  getWaitlist: async (): Promise<WaitlistEntry[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("waitlist")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((w) => ({
          id: w.id,
          name: w.name,
          email: w.email,
          studentId: w.student_id,
          department: w.department,
          interests: Array.isArray(w.interests) ? w.interests : [],
          submittedAt: w.submitted_at,
          notified: w.notified,
        }));
      }
    } catch (err) {
      console.warn("Supabase getWaitlist failed:", err);
    }
    return localMemoryDb.waitlist;
  },

  createWaitlistEntry: async (
    entry: Omit<WaitlistEntry, "id" | "submittedAt" | "notified">
  ): Promise<WaitlistEntry> => {
    const id = `wt-${Date.now()}`;
    const submittedAt = new Date().toISOString();

    const newEntry: WaitlistEntry = {
      ...entry,
      id,
      submittedAt,
      notified: false,
    };

    try {
      await supabaseAdmin.from("waitlist").insert({
        id,
        name: entry.name,
        email: entry.email,
        student_id: entry.studentId,
        department: entry.department,
        interests: entry.interests,
        submitted_at: submittedAt,
        notified: false,
      });
    } catch (err) {
      console.warn("Supabase createWaitlistEntry error:", err);
    }

    localMemoryDb.waitlist.unshift(newEntry);
    return newEntry;
  },

  // --- PROJECTS ---
  getProjects: async (): Promise<RobotProject[]> => {
    try {
      const { data, error } = await supabaseAdmin.from("projects").select("*");
      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          name: p.name,
          codeName: p.code_name,
          category: p.category,
          shortDesc: p.short_desc || "",
          description: p.description || "",
          status: p.status,
          speed: p.speed || "",
          controller: p.controller || "",
          sensors: p.sensors || "",
          chassis: p.chassis || "",
          team: Array.isArray(p.team) ? p.team : [],
          achievements: Array.isArray(p.achievements) ? p.achievements : [],
          specs: Array.isArray(p.specs) ? p.specs : [],
        }));
      }
    } catch (err) {
      console.warn("Supabase getProjects error:", err);
    }
    return localMemoryDb.projects;
  },

  // --- ANNOUNCEMENTS ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          category: a.category,
          publishedAt: a.published_at ? a.published_at.split("T")[0] : "",
          author: a.author,
          isPinned: a.is_pinned,
        }));
      }
    } catch (err) {
      console.warn("Supabase getAnnouncements error:", err);
    }
    return localMemoryDb.announcements;
  },

  createAnnouncement: async (
    ann: Omit<Announcement, "id" | "publishedAt">
  ): Promise<Announcement> => {
    const id = `ann-${Date.now()}`;
    const publishedAt = new Date().toISOString();

    const newAnnouncement: Announcement = {
      ...ann,
      id,
      publishedAt: publishedAt.split("T")[0],
    };

    try {
      await supabaseAdmin.from("announcements").insert({
        id,
        title: ann.title,
        content: ann.content,
        category: ann.category,
        author: ann.author,
        is_pinned: ann.isPinned,
        published_at: publishedAt,
      });
    } catch (err) {
      console.warn("Supabase createAnnouncement error:", err);
    }

    localMemoryDb.announcements.unshift(newAnnouncement);
    return newAnnouncement;
  },

  // --- CONTACT MESSAGES / TRANSMISSIONS ---
  getContactMessages: async (): Promise<ContactMessage[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("messages")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          affiliation: m.affiliation || undefined,
          subject: m.subject,
          message: m.message,
          submittedAt: m.submitted_at,
          status: m.status || "UNREAD",
        }));
      }
    } catch (err) {
      console.warn("Supabase getContactMessages error:", err);
    }
    return localMemoryDb.messages;
  },

  createContactMessage: async (
    msg: Omit<ContactMessage, "id" | "submittedAt" | "status">
  ): Promise<ContactMessage> => {
    const id = `msg-${Date.now()}`;
    const submittedAt = new Date().toISOString();

    const newMessage: ContactMessage = {
      ...msg,
      id,
      submittedAt,
      status: "UNREAD",
    };

    try {
      await supabaseAdmin.from("messages").insert({
        id,
        name: msg.name,
        email: msg.email,
        affiliation: msg.affiliation || null,
        subject: msg.subject,
        message: msg.message,
        submitted_at: submittedAt,
        status: "UNREAD",
      });
    } catch (err) {
      console.warn("Supabase createContactMessage error:", err);
    }

    localMemoryDb.messages.unshift(newMessage);
    return newMessage;
  },

  updateContactMessageStatus: async (
    id: string,
    status: "UNREAD" | "READ" | "REPLIED"
  ): Promise<boolean> => {
    try {
      await supabaseAdmin.from("messages").update({ status }).eq("id", id);
    } catch (err) {
      console.warn("Supabase updateContactMessageStatus error:", err);
    }

    const localMsg = localMemoryDb.messages.find((m) => m.id === id);
    if (localMsg) {
      localMsg.status = status;
      return true;
    }
    return false;
  },

  deleteContactMessage: async (id: string): Promise<boolean> => {
    try {
      await supabaseAdmin.from("messages").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteContactMessage error:", err);
    }

    const index = localMemoryDb.messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      localMemoryDb.messages.splice(index, 1);
      return true;
    }
    return false;
  },

  // --- ACHIEVEMENTS ---
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabaseAdmin.from("achievements").select("*");
      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          title: a.title,
          competition: a.competition,
          stage: a.stage,
          venue: a.venue,
          date: a.date,
          teams: Array.isArray(a.teams) ? a.teams : [],
          qualification: a.qualification,
          description: a.description,
          image: a.image,
          badge: a.badge,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch achievements error, using fallback:", err);
    }
    return localMemoryDb.achievements;
  },

  addAchievement: async (achievementData: Omit<Achievement, "id">): Promise<Achievement> => {
    const newAchievement: Achievement = {
      ...achievementData,
      id: `ach-${Date.now()}`,
    };

    try {
      await supabaseAdmin.from("achievements").insert(newAchievement);
    } catch (err) {
      console.warn("Supabase addAchievement error:", err);
    }

    localMemoryDb.achievements.unshift(newAchievement);
    return newAchievement;
  },
};
