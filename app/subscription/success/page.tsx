import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Subscription Successful | JobAI",
  description: "Your subscription has been successfully activated",
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="container max-w-md py-16 px-4 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>

      <p className="text-lg text-muted-foreground mb-8">
        Thank you for subscribing to JobAI Pro! Your account has been upgraded and you now have access to all premium
        features.
      </p>

      <div className="space-y-4">
        <Button asChild className="w-full gradient-bg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href="/settings/subscription">Manage Subscription</Link>
        </Button>
      </div>
    </div>
  )
}

