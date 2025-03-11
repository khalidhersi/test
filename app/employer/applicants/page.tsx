"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  Loader2,
  Search,
  Calendar,
  FileText,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import {
  type JobApplication,
  type ApplicationStatus,
  getApplicationsForEmployer,
  getJobs,
  type Job,
} from "@/firebase/employer-service"

const statusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-800" },
  reviewed: { bg: "bg-purple-100", text: "text-purple-800" },
  interviewing: { bg: "bg-amber-100", text: "text-amber-800" },
  offered: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
  hired: { bg: "bg-emerald-100", text: "text-emerald-800" },
}

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  new: <Clock className="h-4 w-4" />,
  reviewed: <CheckCircle className="h-4 w-4" />,
  interviewing: <Users className="h-4 w-4" />,
  offered: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  hired: <CheckCircle className="h-4 w-4" />,
}

export default function EmployerApplicants() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [jobs, setJobs] = useState<Record<string, Job>>({})
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "all">("all")

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all jobs first
        const jobsData = await getJobs(user.uid)
        const jobsMap: Record<string, Job> = {}
        jobsData.forEach((job) => {
          jobsMap[job.id] = job
        })
        setJobs(jobsMap)

        // Fetch all applications
        const applicationsData = await getApplicationsForEmployer(user.uid)
        setApplications(applicationsData)
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("Failed to load applications")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredApplications = applications.filter((app) => {
    // Filter by status if not "all"
    if (activeTab !== "all" && app.status !== activeTab) {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        app.name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        jobs[app.jobId]?.title.toLowerCase().includes(searchLower) ||
        false
      )
    }

    return true
  })

  const getStatusCounts = () => {
    const counts: Record<ApplicationStatus | "all", number> = {
      all: applications.length,
      new: 0,
      reviewed: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      hired: 0,
    }

    applications.forEach((app) => {
      counts[app.status]++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading applications...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Applicants
        </h1>
        <p className="text-muted-foreground mt-1">Review and manage job applications</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applicants by name, email, or job title..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications Found</CardTitle>
            <CardDescription>You haven't received any job applications yet</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Applications will appear here once candidates apply to your job postings
            </p>
            <Button asChild>
              <Link href="/employer/jobs">View Your Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ApplicationStatus | "all")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="new">New ({statusCounts.new})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({statusCounts.reviewed})</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing ({statusCounts.interviewing})</TabsTrigger>
            <TabsTrigger value="offered">Offered ({statusCounts.offered})</TabsTrigger>
            <TabsTrigger value="hired">Hired ({statusCounts.hired})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No applications found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((application) => {
                  const job = jobs[application.jobId]
                  const { bg, text } = statusColors[application.status]
                  const statusIcon = statusIcons[application.status]

                  return (
                    <Card key={application.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">{application.name}</h3>
                              <p className="text-muted-foreground">Applied for: {job?.title || "Unknown Job"}</p>
                            </div>
                            <Badge className={`${bg} ${text} self-start`}>
                              <span className="flex items-center gap-1">
                                {statusIcon}
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{application.email}</span>
                            </div>
                            {application.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{application.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Applied: {formatDate(application.createdAt)}</span>
                            </div>
                            {application.resumeUrl && (
                              <div className="flex items-center text-sm">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                <a
                                  href={application.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Resume
                                </a>
                              </div>
                            )}
                          </div>

                          {application.coverLetter && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-1">Cover Letter</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{application.coverLetter}</p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" asChild>
                              <Link href={`/employer/applicants/${application.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

