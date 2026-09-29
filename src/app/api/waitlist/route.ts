import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const waitlist = await db.getWaitlist();
    return NextResponse.json({ success: true, waitlist });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch waitlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, studentId, department, interests } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const entry = await db.createWaitlistEntry({
      name,
      email,
      studentId: studentId || "N/A",
      department: department || "General Engineering",
      interests: interests || ["Robotics"],
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save waitlist entry" }, { status: 500 });
  }
}
