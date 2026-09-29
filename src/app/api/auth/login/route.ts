import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const user = await db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found with this email" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      redirectTo: user.role === "EXECUTIVE" ? "/portal/executive" : "/portal/member",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal authentication error" }, { status: 500 });
  }
}
