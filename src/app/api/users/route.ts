import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, studentId, title, bio, password } = body;

    if (!name || !email || !studentId) {
      return NextResponse.json(
        { success: false, error: "Name, email, and student ID are required." },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();
    const existing = await db.getUserByEmail(emailNormalized);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists." },
        { status: 400 }
      );
    }

    const newUser = await db.createUser({
      name: name.trim(),
      email: emailNormalized,
      studentId: studentId.trim().toUpperCase(),
      role: role === "EXECUTIVE" ? "EXECUTIVE" : "MEMBER",
      title: title?.trim() || (role === "EXECUTIVE" ? "Executive Officer" : "Robotics Member"),
      bio: bio?.trim() || "",
      password: password ? password.trim() : undefined,
      avatar: "/generic-avatar.svg",
      joinedYear: new Date().getFullYear().toString(),
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const updated = await db.updateUser(id, updates);
    return NextResponse.json({ success: updated });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const deleted = await db.deleteUser(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
