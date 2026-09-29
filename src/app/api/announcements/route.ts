import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const announcements = await db.getAnnouncements();
    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, category, author, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcement = await db.createAnnouncement({
      title,
      content,
      category: category || "ANNOUNCEMENT",
      author: author || "Executive Committee",
      isPinned: isPinned || false,
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create announcement" }, { status: 500 });
  }
}
