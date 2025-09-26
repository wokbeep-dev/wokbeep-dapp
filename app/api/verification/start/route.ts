import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { userId, verificationType = "human_verification" } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Generate a unique session token
    const sessionToken = randomBytes(32).toString("hex")

    // Set expiration to 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    // Get client IP and user agent
    const ip = request.headers.get('x-real-ip') || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create verification session
    const { data, error } = await supabase
      .from("verification_sessions")
      .insert({
        user_id: userId,
        session_token: sessionToken,
        verification_type: verificationType,
        expires_at: expiresAt,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating verification session:", error)
      return NextResponse.json({ error: "Failed to create verification session" }, { status: 500 })
    }

    return NextResponse.json({
      sessionToken,
      expiresAt,
      message: "Verification session created successfully",
    })
  } catch (error) {
    console.error("Error in verification start:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
