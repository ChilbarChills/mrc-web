import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const events = await db.getEvents();
    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = await db.createEvent(body);
    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
