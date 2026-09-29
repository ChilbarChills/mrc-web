import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const registrations = await db.getRegistrations();
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, eventTitle, attendeeName, email, phone, institution, teamName } = body;

    if (!eventId || !attendeeName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const registration = await db.createRegistration({
      eventId,
      eventTitle: eventTitle || "MRC Event",
      attendeeName,
      email,
      phone,
      institution: institution || "General Visitor",
      teamName: teamName || "",
    });

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process registration" }, { status: 500 });
  }
}
