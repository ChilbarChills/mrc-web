export type Role = "MEMBER" | "EXECUTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId: string;
  avatar: string;
  joinedYear: string;
  title: string;
  bio?: string;
}

export type EventCategory = "COMPETITION" | "WORKSHOP" | "HACKATHON" | "SEMINAR";

export interface ClubEvent {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  shortDesc: string;
  description: string;
  maxCapacity: number;
  registeredCount: number;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "FULL" | "COMPLETED";
  coverColor: string;
  tags: string[];
}

export interface EventRegistration {
  id: string;
  ticketCode: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  email: string;
  phone: string;
  institution: string;
  teamName?: string;
  registeredAt: string;
  status: "CONFIRMED" | "WAITLISTED";
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  interests: string[];
  submittedAt: string;
  notified: boolean;
}

export interface RobotProject {
  id: string;
  name: string;
  codeName: string;
  category: string;
  shortDesc: string;
  description: string;
  status: "ACTIVE_COMPETITION" | "IN_DEVELOPMENT" | "CHAMPION_ARCHIVE";
  speed: string;
  controller: string;
  sensors: string;
  chassis: string;
  team: string[];
  achievements: string[];
  specs: { label: string; value: string }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "ANNOUNCEMENT" | "ACHIEVEMENT" | "SCHEDULE" | "ALERT";
  publishedAt: string;
  author: string;
  isPinned: boolean;
}
