"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/stripe-actions"
import { cn } from "@/lib/utils"

interface CheckoutButtonProps {
  planId: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  children: React.ReactNode
}

export function CheckoutButton({ planId, className, variant = "default", children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Create a checkout session
      const { url } = await createCheckoutSession(planId)

      if (url) {
        // In a real implementation, this would redirect to Stripe
        // For testing, we'll redirect to our test success page
        router.push(url)
      }
    } catch (error) {
      console.error("[TEST MODE] Error during checkout:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={cn(className)} variant={variant}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

