import { type NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "@/app/actions/stripe-actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const planId = formData.get("planId") as string

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Create a checkout session
    const { url } = await createCheckoutSession(planId)

    // Redirect to the checkout URL
    return NextResponse.redirect(url || "/pricing")
  } catch (error) {
    console.error("[TEST MODE] Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

