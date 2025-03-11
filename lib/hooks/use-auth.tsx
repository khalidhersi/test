"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/firebase"
import { getUserProfile } from "@/firebase/profile-service"

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isEmployer?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEmployer, setIsEmployer] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get basic user info from Firebase Auth
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }

          // Get additional user profile data
          try {
            const userProfile = await getUserProfile(firebaseUser.uid)
            if (userProfile) {
              userData.isEmployer = userProfile.isEmployer || false
              setIsEmployer(userProfile.isEmployer || false)
            }
          } catch (error) {
            console.error("Error fetching user profile:", error)
          }

          setUser(userData)
        } else {
          setUser(null)
          setIsEmployer(false)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, loading, isEmployer }
}

