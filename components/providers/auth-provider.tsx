"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { authService } from "@/lib/firebase/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser } = useAuth()

  useEffect(() => {
    // Load user on initial mount
    loadUser()

    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        useAuth.setState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        // User is signed out
        useAuth.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    })

    // Clean up subscription
    return () => unsubscribe()
  }, [loadUser])

  return <>{children}</>
}

