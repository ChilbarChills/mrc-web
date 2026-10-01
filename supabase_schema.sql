-- ==============================================================================
-- MANARAT ROBOTICS CLUB (MRC) SUPABASE DATABASE SCHEMA
-- Run this script in the Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  short_desc TEXT,
  description TEXT,
  max_capacity INTEGER DEFAULT 100,
  registered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'REGISTRATION_OPEN',
  cover_color TEXT DEFAULT '#0050ff',
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  ticket_code TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT NOT NULL,
  team_name TEXT,
  status TEXT DEFAULT 'CONFIRMED',
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WAITLIST / RECRUITMENT TABLE
CREATE TABLE IF NOT EXISTS public.waitlist (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT NOT NULL,
  department TEXT NOT NULL,
  interests JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);

-- 4. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'ANNOUNCEMENT',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT DEFAULT 'Executive Committee',
  is_pinned BOOLEAN DEFAULT FALSE
);

-- 5. ROBOT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code_name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT,
  description TEXT,
  status TEXT DEFAULT 'ACTIVE_COMPETITION',
  speed TEXT,
  controller TEXT,
  sensors TEXT,
  chassis TEXT,
  team JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USERS / EXECUTIVE COMMITTEE TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  student_id TEXT NOT NULL,
  avatar TEXT,
  joined_year TEXT,
  title TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable full read/write for service role & anon
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
