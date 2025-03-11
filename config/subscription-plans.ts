export type PlanInterval = "month" | "year"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  features: string[]
  price: {
    amount: number
    currency: string
    interval: PlanInterval
    originalAmount?: number // For displaying discounted prices
  }
  stripePriceId: {
    test: string
    production: string
  }
  popular?: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic job search and application tracking",
    features: ["Up to 5 job applications", "Basic job search", "Application tracking", "Limited profile customization"],
    price: {
      amount: 0,
      currency: "GBP",
      interval: "month",
    },
    stripePriceId: {
      test: "",
      production: "",
    },
  },
  {
    id: "pro-monthly",
    name: "Pro",
    description: "Advanced features for serious job seekers",
    features: [
      "Unlimited job applications",
      "Advanced job search filters",
      "AI resume optimization",
      "Application analytics",
      "Priority support",
      "Custom job alerts",
    ],
    price: {
      amount: 899, // In pence (£8.99)
      currency: "GBP",
      interval: "month",
    },
    stripePriceId: {
      test: "price_test_monthly_1234", // PLACEHOLDER: Replace with actual Stripe price ID
      production: "price_prod_monthly_1234", // PLACEHOLDER: Replace with actual Stripe price ID
    },
    popular: true,
  },
  {
    id: "pro-yearly",
    name: "Pro (Annual)",
    description: "Our best value plan with 2 months free",
    features: [
      "All Pro features",
      "Unlimited job applications",
      "Advanced job search filters",
      "AI resume optimization",
      "Application analytics",
      "Priority support",
      "Custom job alerts",
      "2 months free",
    ],
    price: {
      amount: 8990, // In pence (£89.90 for the year, equivalent to 10 months)
      currency: "GBP",
      interval: "year",
      originalAmount: 10788, // Original price without discount (£107.88 = £8.99 × 12)
    },
    stripePriceId: {
      test: "price_test_yearly_1234", // PLACEHOLDER: Replace with actual Stripe price ID
      production: "price_prod_yearly_1234", // PLACEHOLDER: Replace with actual Stripe price ID
    },
  },
]

export const getFormattedPrice = (plan: SubscriptionPlan): string => {
  const { amount, currency, interval } = plan.price

  // Format the price in pounds (convert from pence)
  const formattedAmount = (amount / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  })

  // For free plan
  if (amount === 0) {
    return "Free"
  }

  // For monthly plan
  if (interval === "month") {
    return `${formattedAmount}/month`
  }

  // For yearly plan
  return `${formattedAmount}/year`
}

export const getMonthlyPrice = (plan: SubscriptionPlan): string => {
  const { amount, currency, interval } = plan.price

  // For free plan
  if (amount === 0) {
    return "Free"
  }

  // For monthly plan
  if (interval === "month") {
    return (amount / 100).toLocaleString("en-GB", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })
  }

  // For yearly plan, calculate the effective monthly price
  const monthlyAmount = amount / 12
  return (monthlyAmount / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  })
}

export const getSavingsAmount = (plan: SubscriptionPlan): string | null => {
  if (plan.price.originalAmount && plan.price.interval === "year") {
    const savings = plan.price.originalAmount - plan.price.amount
    return (savings / 100).toLocaleString("en-GB", {
      style: "currency",
      currency: plan.price.currency,
      minimumFractionDigits: 2,
    })
  }
  return null
}

export const getSavingsPercentage = (plan: SubscriptionPlan): string | null => {
  if (plan.price.originalAmount && plan.price.interval === "year") {
    const savings = plan.price.originalAmount - plan.price.amount
    const percentage = Math.round((savings / plan.price.originalAmount) * 100)
    return `${percentage}%`
  }
  return null
}

