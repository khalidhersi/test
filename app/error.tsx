"use client"

import ErrorBoundary from "@/components/error-boundary"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Ensure reset is properly passed to ErrorBoundary
  return <ErrorBoundary error={error} reset={reset} />
}

