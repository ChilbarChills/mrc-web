import fs from "fs";
import path from "path";
import { ClubEvent, EventRegistration, RobotProject, User, Announcement, WaitlistEntry } from "./types";
import {
  initialUsers,
  initialEvents,
  initialProjects,
  initialAnnouncements,
  initialRegistrations,
  initialWaitlist,
} from "./seed-data";

interface DatabaseSchema {
  users: User[];
  events: ClubEvent[];
  registrations: EventRegistration[];
  projects: RobotProject[];
  announcements: Announcement[];
  waitlist: WaitlistEntry[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "mrc_store.json");

// In-memory cache for ultra-fast access, synced to disk
let memoryDb: DatabaseSchema | null = null;

function ensureDataFile(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(fileData);
      return memoryDb!;
    }
  } catch (err) {
    console.warn("Could not read db file from disk, initializing from seed:", err);
  }

  // Seed default data
  memoryDb = {
    users: initialUsers,
    events: initialEvents,
    registrations: initialRegistrations,
    projects: initialProjects,
    announcements: initialAnnouncements,
    waitlist: initialWaitlist,
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write initial seed db to disk:", err);
  }

  return memoryDb;
}

function persistData(db: DatabaseSchema) {
  memoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist database to disk:", err);
  }
}

export const db = {
  // --- USERS & AUTH ---
  getUsers: async (): Promise<User[]> => {
    const data = ensureDataFile();
    return data.users;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const data = ensureDataFile();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById: async (id: string): Promise<User | null> => {
    const data = ensureDataFile();
    return data.users.find((u) => u.id === id) || null;
  },

  // --- EVENTS ---
  getEvents: async (): Promise<ClubEvent[]> => {
    const data = ensureDataFile();
    return data.events;
  },

  getEventBySlug: async (slug: string): Promise<ClubEvent | null> => {
    const data = ensureDataFile();
    return data.events.find((e) => e.slug === slug || e.id === slug) || null;
  },

  createEvent: async (newEvent: Omit<ClubEvent, "id" | "registeredCount">): Promise<ClubEvent> => {
    const data = ensureDataFile();
    const event: ClubEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
    };
    data.events.unshift(event);
    persistData(data);
    return event;
  },

  updateEvent: async (id: string, updates: Partial<ClubEvent>): Promise<ClubEvent | null> => {
    const data = ensureDataFile();
    const index = data.events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    data.events[index] = { ...data.events[index], ...updates };
    persistData(data);
    return data.events[index];
  },

  // --- REGISTRATIONS ---
  getRegistrations: async (): Promise<EventRegistration[]> => {
    const data = ensureDataFile();
    return data.registrations;
  },

  getRegistrationsByEvent: async (eventId: string): Promise<EventRegistration[]> => {
    const data = ensureDataFile();
    return data.registrations.filter((r) => r.eventId === eventId);
  },

  createRegistration: async (
    reg: Omit<EventRegistration, "id" | "ticketCode" | "registeredAt" | "status">
  ): Promise<EventRegistration> => {
    const data = ensureDataFile();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newRegistration: EventRegistration = {
      ...reg,
      id: `reg-${Date.now()}`,
      ticketCode: `MRC-EVT-${randomCode}`,
      registeredAt: new Date().toISOString(),
      status: "CONFIRMED",
    };

    data.registrations.unshift(newRegistration);

    // Increment event registration count
    const event = data.events.find((e) => e.id === reg.eventId);
    if (event) {
      event.registeredCount = (event.registeredCount || 0) + 1;
      if (event.registeredCount >= event.maxCapacity) {
        event.status = "FULL";
      }
    }

    persistData(data);
    return newRegistration;
  },

  // --- RECRUITMENT WAITLIST ("Will Open Soon") ---
  getWaitlist: async (): Promise<WaitlistEntry[]> => {
    const data = ensureDataFile();
    return data.waitlist;
  },

  createWaitlistEntry: async (
    entry: Omit<WaitlistEntry, "id" | "submittedAt" | "notified">
  ): Promise<WaitlistEntry> => {
    const data = ensureDataFile();
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wt-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      notified: false,
    };
    data.waitlist.unshift(newEntry);
    persistData(data);
    return newEntry;
  },

  // --- PROJECTS ---
  getProjects: async (): Promise<RobotProject[]> => {
    const data = ensureDataFile();
    return data.projects;
  },

  // --- ANNOUNCEMENTS / TRANSMISSIONS ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    const data = ensureDataFile();
    return data.announcements;
  },

  createAnnouncement: async (
    ann: Omit<Announcement, "id" | "publishedAt">
  ): Promise<Announcement> => {
    const data = ensureDataFile();
    const newAnnouncement: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
    };
    data.announcements.unshift(newAnnouncement);
    persistData(data);
    return newAnnouncement;
  },
};
