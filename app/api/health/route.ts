import { NextResponse } from "next/server"
import { db } from "@/lib/drizzle"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // Check database connection
    await db.execute("SELECT 1")

    // Check Redis connection
    await redis.ping()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        redis: "connected",
      },
    })
  } catch (error) {
    console.error("[v0] Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Service unavailable",
      },
      { status: 503 },
    )
  }
}
