"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateUserSubscription } from "@/app/actions/stripe-actions"

export default function TestSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")
  const [isUpdating, setIsUpdating] = useState(true)

  useEffect(() => {
    const simulateSubscriptionUpdate = async () => {
      try {
        // In a real implementation, this would be handled by a webhook
        // For testing, we'll simulate updating the user's subscription
        if (planId) {
          await updateUserSubscription("test_user_123", planId)
        }

        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsUpdating(false)
      } catch (error) {
        console.error("[TEST MODE] Error updating subscription:", error)
        setIsUpdating(false)
      }
    }

    simulateSubscriptionUpdate()
  }, [planId])

  return (
    <div className="container max-w-md py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
          <CardDescription>
            {isUpdating ? "Processing your subscription..." : "Your subscription has been activated"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            {isUpdating
              ? "Please wait while we set up your account..."
              : `Thank you for subscribing to our ${planId === "pro-yearly" ? "Pro (Annual)" : "Pro"} plan. Your account has been upgraded and you now have access to all premium features.`}
          </p>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              [TEST MODE] This is a test implementation. In production, this would be handled by Stripe webhooks.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isUpdating && (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/subscription">Manage Subscription</Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

