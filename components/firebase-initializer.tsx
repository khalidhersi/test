"use client"

import { useEffect, useState } from "react"
import { seedJobs } from "@/lib/job-service"

export function FirebaseInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Seed jobs data
        await seedJobs()
        setInitialized(true)
        console.log("Firebase data initialized successfully")
      } catch (error) {
        console.error("Error initializing Firebase data:", error)
      }
    }

    if (!initialized) {
      initializeFirebase()
    }
  }, [initialized])

  // This component doesn't render anything
  return null
}

