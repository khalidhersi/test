import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionManagement } from "@/components/subscription-management"

export const metadata: Metadata = {
  title: "Subscription Settings | JobAI",
  description: "Manage your subscription and billing information",
}

export default function SubscriptionSettingsPage() {
  return (
    <div className="container max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Subscription Settings</h1>

      <div className="space-y-8">
        <SubscriptionManagement />

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your billing history and invoices are available in the Stripe customer portal.
            </p>
            <div className="text-sm text-muted-foreground mt-4 p-2 bg-muted rounded-md">
              <p className="font-medium">[TEST MODE]</p>
              <p>This is a test implementation. In production, this would connect to the Stripe customer portal.</p>
            </div>
          </CardContent>
          <CardFooter>
            <form action="/api/create-portal" method="POST">
              <Button type="submit">Manage Billing History</Button>
            </form>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You can update your payment methods in the Stripe customer portal.</p>
            <div className="text-sm text-muted-foreground mt-4 p-2 bg-muted rounded-md">
              <p className="font-medium">[TEST MODE]</p>
              <p>This is a test implementation. In production, this would connect to the Stripe customer portal.</p>
            </div>
          </CardContent>
          <CardFooter>
            <form action="/api/create-portal" method="POST">
              <Button type="submit">Manage Payment Methods</Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

