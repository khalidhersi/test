import type { Metadata } from "next"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  subscriptionPlans,
  getFormattedPrice,
  getMonthlyPrice,
  getSavingsAmount,
  getSavingsPercentage,
} from "@/config/subscription-plans"
import { cn } from "@/lib/utils"
import { CheckoutButton } from "@/components/checkout-button"

export const metadata: Metadata = {
  title: "Pricing | JobAI",
  description: "Choose the perfect plan for your job search needs",
}

export default function PricingPage() {
  return (
    <div className="container max-w-5xl py-16 px-4 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan to accelerate your job search and land your dream role faster.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className={cn("flex flex-col", plan.popular && "border-primary shadow-lg relative")}>
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                  Most Popular
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{getMonthlyPrice(plan)}</span>
                  {plan.price.amount > 0 && <span className="text-muted-foreground ml-2">/month</span>}
                </div>
                {plan.price.interval === "year" && (
                  <div className="mt-1 text-sm text-muted-foreground">Billed annually ({getFormattedPrice(plan)})</div>
                )}
                {getSavingsAmount(plan) && (
                  <div className="mt-2 inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-2 py-1 rounded">
                    Save {getSavingsAmount(plan)} ({getSavingsPercentage(plan)})
                  </div>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.price.amount === 0 ? (
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              ) : (
                <CheckoutButton planId={plan.id} className={cn("w-full", plan.popular && "gradient-bg")}>
                  Subscribe Now
                </CheckoutButton>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <div>
            <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to Pro features
              until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How does the annual discount work?</h3>
            <p className="text-muted-foreground">
              Our annual plan gives you 2 months free compared to the monthly plan. You'll be billed once per year at
              the discounted rate.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit and debit cards, including Visa, Mastercard, and American Express.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              We offer a free plan with limited features so you can try out the platform before subscribing to a Pro
              plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

