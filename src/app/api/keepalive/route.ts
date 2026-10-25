import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const startTime = Date.now();

  try {
    // Run a lightweight query to wake up and keep Supabase active
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("id")
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          latencyMs: latency,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "AWAKE",
      message: "Supabase cloud database keep-alive pulse registered successfully.",
      latencyMs: latency,
      database: "PostgreSQL (Supabase)",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Keep-alive ping failed",
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
