"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionBannerProps {
  className?: string
  // In a real implementation, this would come from the user's data
  // For testing, we'll use a prop
  subscriptionStatus?: "free" | "pro-monthly" | "pro-yearly"
}

export function SubscriptionBanner({
  className,
  subscriptionStatus = "free", // Default to free
}: SubscriptionBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  // For paid subscribers, show a different message
  if (subscriptionStatus !== "free") {
    return (
      <Card className={cn("relative overflow-hidden border-primary/20", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-background/0" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                {subscriptionStatus === "pro-yearly" ? "Pro Annual" : "Pro"}
              </Badge>
              <p className="text-sm font-medium">Your subscription is active. Thank you for supporting JobAI!</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings/subscription">Manage Subscription</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // For free users, show an upgrade prompt
  return (
    <Card className={cn("relative overflow-hidden border-primary/20", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background/0" />
      <CardContent className="p-6">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-5 w-5 text-primary" />
              Upgrade to JobAI Pro
            </h3>
            <p className="text-sm text-muted-foreground">Unlock premium features to accelerate your job search</p>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {[
                "Unlimited job applications",
                "AI resume optimization",
                "Advanced job search filters",
                "Application analytics",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-center">
              <span className="text-2xl font-bold">£8.99</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <Button className="gradient-hover" asChild>
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

