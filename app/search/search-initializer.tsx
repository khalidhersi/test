"use client"

import { useEffect } from "react"
import { seedJobs } from "@/lib/job-service"

export function SearchInitializer() {
  useEffect(() => {
    // Initialize jobs data when the search page loads
    seedJobs().catch((error) => {
      console.error("Error seeding jobs:", error)
    })
  }, [])

  // This component doesn't render anything
  return null
}

