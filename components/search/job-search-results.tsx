"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, DollarSign, Loader2 } from "lucide-react"
import { QuickApplyDialog } from "@/components/quick-apply-dialog"
import { saveJob } from "@/lib/job-service"
import { useToast } from "@/components/ui/use-toast"
import type { Job } from "@/lib/job-service"

interface JobSearchResultsProps {
  jobs: Job[]
  isLoading: boolean
}

// Demo jobs for fallback
const demoJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    description:
      "We are seeking a talented Senior Software Engineer to join our engineering team. You will be responsible for developing and maintaining high-quality software solutions.",
    salary: "$150k - $200k",
    type: "Full-time",
    requirements: ["5+ years experience", "React", "Node.js", "AWS"],
    url: "https://example.com/jobs/1",
    posted: "2 days ago",
    remote: true,
    source: "Internal",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupCo",
    location: "New York, NY",
    description:
      "Join our fast-growing startup as a Full Stack Developer. Work on cutting-edge technologies and help shape our product roadmap.",
    salary: "$120k - $160k",
    type: "Full-time",
    requirements: ["3+ years experience", "JavaScript", "Python", "MongoDB"],
    url: "https://example.com/jobs/2",
    posted: "1 day ago",
    remote: true,
    source: "LinkedIn",
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "DesignLabs",
    location: "Remote",
    description:
      "Looking for a Frontend Developer to create beautiful and responsive web applications. Focus on user experience and modern design principles.",
    salary: "$100k - $130k",
    type: "Full-time",
    requirements: ["React", "TypeScript", "CSS", "UI/UX"],
    url: "https://example.com/jobs/3",
    posted: "3 days ago",
    remote: true,
    source: "Indeed",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    description:
      "Join our DevOps team to build and maintain our cloud infrastructure. Experience with AWS and automation required.",
    salary: "$130k - $180k",
    type: "Full-time",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    url: "https://example.com/jobs/4",
    posted: "1 week ago",
    remote: false,
    source: "Internal",
  },
  {
    id: "5",
    title: "Product Manager",
    company: "ProductLabs",
    location: "Austin, TX",
    description:
      "Seeking an experienced Product Manager to lead our product development initiatives and work closely with engineering teams.",
    salary: "$140k - $180k",
    type: "Full-time",
    requirements: ["5+ years PM experience", "Agile", "Technical background"],
    url: "https://example.com/jobs/5",
    posted: "4 days ago",
    remote: true,
    source: "LinkedIn",
  },
]

export function JobSearchResults({ jobs, isLoading }: JobSearchResultsProps) {
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const { toast } = useToast()

  const handleSaveJob = async (jobId: string) => {
    try {
      await saveJob(jobId)
      setSavedJobs([...savedJobs, jobId])
      toast({
        title: "Job saved",
        description: "This job has been saved to your profile.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save job. Please try again.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Searching for jobs...</p>
      </div>
    )
  }

  // Use demo jobs if no jobs are provided
  const displayJobs = jobs && jobs.length > 0 ? jobs : demoJobs

  return (
    <div className="space-y-4 mt-4 sm:mt-0">
      {displayJobs.map((job) => (
        <Card key={job.id} className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start gap-2">
                <h3 className="font-semibold text-base sm:text-lg flex-grow">{job.title}</h3>
                {job.remote && <Badge variant="secondary">Remote</Badge>}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building className="h-4 w-4 flex-shrink-0" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {job.location}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    {job.salary}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm">{job.description}</p>

            <div className="flex flex-wrap gap-2">
              {job.requirements?.map((req, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {req}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{job.source}</Badge>
                <span className="text-sm text-muted-foreground">{job.posted}</span>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-auto">
                <Button
                  variant="outline"
                  onClick={() => handleSaveJob(job.id)}
                  className="flex-1 sm:flex-none h-10 text-sm sm:text-base"
                >
                  Save Job
                </Button>
                <div className="flex-1 sm:flex-none">
                  <QuickApplyDialog job={job} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

