"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { createPortalSession } from "@/app/actions/stripe-actions"

// PLACEHOLDER: This is a mock implementation for testing
// Replace with actual user data later

// Mock user subscription data
const mockSubscription = {
  status: "active", // 'active' or 'inactive'
  plan: "pro-monthly", // 'free', 'pro-monthly', or 'pro-yearly'
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
}

export function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // In a real implementation, get the user's subscription from your auth hook
  // For testing, we'll use our mock data
  const subscription = mockSubscription

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)

      // In a real implementation, create a portal session
      // For testing, we'll use our mock function
      const { url } = await createPortalSession()

      if (url) {
        // In a real implementation, this would redirect to Stripe
        // For testing, we'll redirect to our test page
        router.push(url)
      }
    } catch (error) {
      console.error("[TEST MODE] Error opening customer portal:", error)
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </div>
          {subscription.status === "active" && (
            <Badge variant="outline" className="ml-2">
              {subscription.status === "active" ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {subscription.status === "active" ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Current Plan</div>
              <div className="text-xl font-bold">
                {subscription.plan === "pro-monthly"
                  ? "Pro (Monthly)"
                  : subscription.plan === "pro-yearly"
                    ? "Pro (Annual)"
                    : "Free"}
              </div>
            </div>

            {subscription.currentPeriodEnd && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Next Billing Date</div>
                <div>
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground mt-4 p-2 bg-muted rounded-md">
              <p className="font-medium">[TEST MODE]</p>
              <p>
                This is a test implementation. In production, this would display your actual subscription details from
                Stripe.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4">You are currently on the Free plan with limited features.</p>
            <p className="text-muted-foreground">
              Upgrade to Pro to unlock all features and accelerate your job search.
            </p>

            <div className="text-sm text-muted-foreground mt-4 p-2 bg-muted rounded-md">
              <p className="font-medium">[TEST MODE]</p>
              <p>
                This is a test implementation. In production, this would display your actual subscription details from
                Stripe.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {subscription.status === "active" ? (
          <Button onClick={handleManageSubscription} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Manage Subscription"
            )}
          </Button>
        ) : (
          <Button onClick={() => router.push("/pricing")} className="gradient-bg">
            Upgrade to Pro
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

