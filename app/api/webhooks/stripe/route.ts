import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/firebase/firebase"
import { ref, set, get } from "firebase/database"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// This is your Stripe webhook secret for testing your endpoint locally
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.client_reference_id

    if (!userId) {
      console.error("No userId found in session metadata")
      return
    }

    // Get the subscription
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      // Update the user's subscription in Firebase
      const userRef = ref(db, `users/${userId}`)
      const userSnapshot = await get(userRef)

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val()

        // Get the plan ID from the subscription
        const priceId = subscription.items.data[0].price.id
        let planId = "pro-monthly" // Default

        // Map the price ID to your plan IDs
        if (priceId === "price_test_yearly_1234") {
          planId = "pro-yearly"
        }

        // Update the user's subscription
        await set(ref(db, `users/${userId}`), {
          ...userData,
          subscription: {
            status: subscription.status,
            plan: planId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            currentPeriodEnd: subscription.current_period_end * 1000, // Convert to milliseconds
          },
        })
      }
    }
  } catch (error) {
    console.error("Error handling checkout session completed:", error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Find the user with this subscription
    const userRef = ref(db, "users")
    const usersSnapshot = await get(userRef)

    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val()

      // Find the user with this subscription ID
      let userId: string | null = null
      let userData: any = null

      Object.entries(users).forEach(([id, user]: [string, any]) => {
        if (user.subscription?.stripeSubscriptionId === subscription.id) {
          userId = id
          userData = user
        }
      })

      if (userId && userData) {
        // Get the plan ID from the subscription
        const priceId = subscription.items.data[0].price.id
        let planId = "pro-monthly" // Default

        // Map the price ID to your plan IDs
        if (priceId === "price_test_yearly_1234") {
          planId = "pro-yearly"
        }

        // Update the user's subscription
        await set(ref(db, `users/${userId}`), {
          ...userData,
          subscription: {
            status: subscription.status,
            plan: planId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            currentPeriodEnd: subscription.current_period_end * 1000, // Convert to milliseconds
          },
        })
      }
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error)
    throw error
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Find the user with this subscription
    const userRef = ref(db, "users")
    const usersSnapshot = await get(userRef)

    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val()

      // Find the user with this subscription ID
      let userId: string | null = null
      let userData: any = null

      Object.entries(users).forEach(([id, user]: [string, any]) => {
        if (user.subscription?.stripeSubscriptionId === subscription.id) {
          userId = id
          userData = user
        }
      })

      if (userId && userData) {
        // Update the user's subscription
        await set(ref(db, `users/${userId}`), {
          ...userData,
          subscription: {
            status: "inactive",
            plan: "free",
            stripeSubscriptionId: null,
            stripeCustomerId: subscription.customer as string,
            currentPeriodEnd: null,
          },
        })
      }
    }
  } catch (error) {
    console.error("Error handling subscription deleted:", error)
    throw error
  }
}

