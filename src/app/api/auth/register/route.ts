import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, studentId, department, password, role } = body;

    if (!name || !email || !studentId) {
      return NextResponse.json(
        { success: false, error: "Name, email, and student ID are required." },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await db.getUserByEmail(emailNormalized);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    const assignedRole = role === "EXECUTIVE" ? "EXECUTIVE" : "MEMBER";
    const deptTitle = department ? `Member • ${department} Dept` : "Robotics Member";

    const newUser = await db.createUser({
      name: name.trim(),
      email: emailNormalized,
      studentId: studentId.trim().toUpperCase(),
      role: assignedRole,
      title: deptTitle,
      department: department || "Technology",
      password: password ? password.trim() : undefined,
      avatar: "/generic-avatar.svg",
      joinedYear: new Date().getFullYear().toString(),
      bio: "Member of Manarat Robotics Club",
    });

    return NextResponse.json(
      {
        success: true,
        user: newUser,
        redirectTo: newUser.role === "EXECUTIVE" ? "/portal/executive" : "/portal/member",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
