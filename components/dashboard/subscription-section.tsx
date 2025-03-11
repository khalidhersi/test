"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// In a real implementation, this would come from user data
// For testing, we'll use this mock data
const mockSubscriptionData = {
  status: "free", // 'free', 'pro-monthly', or 'pro-yearly'
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  usageStats: {
    applicationsUsed: 3,
    applicationsLimit: 5,
    applicationsPercentage: 60,
  },
}

interface SubscriptionSectionProps {
  className?: string
}

export function SubscriptionSection({ className }: SubscriptionSectionProps) {
  const subscription = mockSubscriptionData
  const isPro = subscription.status !== "free"

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription and usage</CardDescription>
          </div>
          {isPro ? (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 ml-2">
              {subscription.status === "pro-yearly" ? "Pro Annual" : "Pro"}
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-2">
              Free
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isPro ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Subscription Status</div>
              <div className="text-lg font-semibold">
                {subscription.status === "pro-monthly" ? "Pro Monthly" : "Pro Annual"}
              </div>
            </div>

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

            <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
              <p>
                [TEST MODE] This is a test implementation. In production, this would display your actual subscription
                details.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Current Plan</div>
              <div className="text-lg font-semibold">Free</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Applications</div>
              <div className="flex items-center justify-between">
                <span>
                  {subscription.usageStats.applicationsUsed} of {subscription.usageStats.applicationsLimit} used
                </span>
                <span className="text-sm text-muted-foreground">{subscription.usageStats.applicationsPercentage}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${subscription.usageStats.applicationsPercentage}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold">Upgrade to Pro</h4>
                  <p className="text-sm text-muted-foreground mb-3">Unlock premium features and remove limits</p>
                  <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {[
                      "Unlimited job applications",
                      "AI resume optimization",
                      "Advanced job search filters",
                      "Application analytics",
                      "Priority support",
                      "Custom job alerts",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPro ? (
          <Button asChild>
            <Link href="/settings/subscription">Manage Subscription</Link>
          </Button>
        ) : (
          <Button className="gradient-hover" asChild>
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

