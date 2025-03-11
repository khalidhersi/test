"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Spinner } from "@/components/ui/spinner"

interface AuthWrapperProps {
  children: ReactNode
  requireAuth?: boolean
  requireEmployer?: boolean
}

export function AuthWrapper({ children, requireAuth = false, requireEmployer = false }: AuthWrapperProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !user) {
    // You might want to redirect to login here
    // For now, just show a message
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground">Please sign in to access this page.</p>
      </div>
    )
  }

  if (requireEmployer && (!profile || profile.role !== "employer")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Employer Access Required</h2>
        <p className="text-muted-foreground">You need an employer account to access this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

