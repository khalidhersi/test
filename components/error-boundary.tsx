"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  error: Error & { digest?: string }
  reset?: () => void // Make reset optional
}

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to Sentry only if it exists
    if (error) {
      Sentry.captureException(error)
    }
  }, [error])

  // Handle the case where reset is not provided
  const handleReset = () => {
    if (typeof reset === "function") {
      reset()
    } else {
      // Fallback to window reload if reset is not available
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
          {/* Only show error message if it exists and we're in development */}
          {error?.message && process.env.NODE_ENV === "development" && (
            <Card className="w-full p-4 bg-muted/50 text-left">
              <pre className="text-xs overflow-auto whitespace-pre-wrap break-words">{error.message}</pre>
            </Card>
          )}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
            <Button onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

