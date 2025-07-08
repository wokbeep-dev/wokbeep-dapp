import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { sessionToken, success = true } = await request.json()

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token is required" }, { status: 400 })
    }

    // Update verification session
    const { data: session, error: sessionError } = await supabaseServer
      .from("verification_sessions")
      .update({
        status: success ? "completed" : "failed",
        completed_at: new Date().toISOString(),
      })
      .eq("session_token", sessionToken)
      .select()
      .single()

    if (sessionError) {
      console.error("Error updating verification session:", sessionError)
      return NextResponse.json({ error: "Failed to update verification session" }, { status: 500 })
    }

    // If verification was successful, update user verification status
    if (success && session) {
      const { error: userError } = await supabaseServer
        .from("users")
        .update({ verification_status: "verified" })
        .eq("id", session.user_id)

      if (userError) {
        console.error("Error updating user verification status:", userError)
        return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: success ? "Verification completed successfully" : "Verification failed",
    })
  } catch (error) {
    console.error("Error in verification complete:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
