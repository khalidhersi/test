"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, DollarSign, Loader2 } from "lucide-react"
import { searchJobs } from "@/lib/job-service"
import type { Job } from "@/lib/job-service"
import { QuickApplyDialog } from "@/components/quick-apply-dialog"

export function JobRecommendations() {
  const [recommendations, setRecommendations] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [userProfile, setUserProfile] = useState<{ location?: string } | null>(null) // Mock user profile

  useEffect(() => {
    // Prevent multiple fetch attempts
    if (hasAttemptedFetch) return

    async function fetchRecommendations() {
      setHasAttemptedFetch(true)
      setIsLoading(true)
      try {
        // Add a small delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const result = await searchJobs({
          query: "software developer", // Default search term
          limit: 3,
          // Add more specific parameters based on user profile if available
          ...(userProfile?.location ? { location: userProfile.location } : {}),
        })

        setRecommendations(result.jobs || [])
      } catch (error) {
        console.error("Error fetching job recommendations:", error)
        setError("Failed to load recommendations")
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [hasAttemptedFetch, userProfile?.location])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">{error}. Please try again later.</div>
        </CardContent>
      </Card>
    )
  }

  // Make the job recommendations more responsive
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No job recommendations available at the moment.</div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row items-start justify-between border rounded-lg p-4 gap-4"
              >
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <Badge variant="secondary">95% Match</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements &&
                      job.requirements.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
                <QuickApplyDialog job={job} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

