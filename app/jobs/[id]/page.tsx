"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { JobApplicationModal } from "@/components/job-application-modal"
import { formatDistanceToNow } from "date-fns"
import { Building2, MapPin, Calendar, Briefcase, DollarSign } from "lucide-react"

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobRef = ref(db, `jobs/${id}`)
        const snapshot = await get(jobRef)

        if (snapshot.exists()) {
          setJob({ id: snapshot.key, ...snapshot.val() })
        } else {
          console.error("Job not found")
        }
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-12 w-40" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p>The job you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  const postedDate = job.createdAt ? new Date(job.createdAt) : new Date()

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Building2 className="h-4 w-4 mr-1" />
                {job.company}
              </CardDescription>
            </div>
            <Button onClick={() => setIsApplicationModalOpen(true)}>Apply Now</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Posted {formatDistanceToNow(postedDate, { addSuffix: true })}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Briefcase className="h-3 w-3 mr-1" />
              {job.type}
            </Badge>
            {job.salary && (
              <Badge variant="outline" className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {job.salary}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <div className="whitespace-pre-line">{job.description}</div>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <div className="whitespace-pre-line">{job.requirements}</div>
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <div className="whitespace-pre-line">{job.benefits}</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={() => setIsApplicationModalOpen(true)}>
            Apply for this Position
          </Button>
        </CardFooter>
      </Card>

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company}
      />
    </div>
  )
}

