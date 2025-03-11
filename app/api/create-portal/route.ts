import { type NextRequest, NextResponse } from "next/server"
import { createPortalSession } from "@/app/actions/stripe-actions"

export async function POST(request: NextRequest) {
  try {
    // Create a portal session
    const { url } = await createPortalSession()

    // Redirect to the portal URL
    return NextResponse.redirect(url || "/settings/subscription")
  } catch (error) {
    console.error("[TEST MODE] Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}

