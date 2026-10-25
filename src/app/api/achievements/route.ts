import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const achievements = await db.getAchievements();
    return NextResponse.json({ success: true, achievements });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
