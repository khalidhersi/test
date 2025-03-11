"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get, update } from "firebase/database"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Building2, Calendar, Mail, Phone, FileText, User } from "lucide-react"

export default function EmployerApplicationsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const jobIdParam = searchParams.get("jobId")

  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string>(jobIdParam || "all")

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!user) return

      try {
        // Fetch employer's jobs
        const jobsRef = ref(db, "jobs")
        const employerJobsQuery = query(jobsRef, orderByChild("employerId"), equalTo(user.uid))

        const jobsSnapshot = await get(employerJobsQuery)

        const jobsData: any[] = []
        if (jobsSnapshot.exists()) {
          jobsSnapshot.forEach((childSnapshot) => {
            jobsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            })
          })
          setJobs(jobsData)
        }

        // Fetch all applications for employer's jobs
        const applicationsRef = ref(db, "applications")
        const applicationsData: any[] = []

        for (const job of jobsData) {
          const jobApplicationsQuery = query(applicationsRef, orderByChild("jobId"), equalTo(job.id))

          const appSnapshot = await get(jobApplicationsQuery)

          if (appSnapshot.exists()) {
            appSnapshot.forEach((childSnapshot) => {
              applicationsData.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              })
            })
          }
        }

        // Sort by creation date (newest first)
        applicationsData.sort((a, b) => {
          return (b.createdAt || 0) - (a.createdAt || 0)
        })

        setApplications(applicationsData)
      } catch (error) {
        console.error("Error fetching employer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployerData()
  }, [user])

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const applicationRef = ref(db, `applications/${applicationId}`)
      await update(applicationRef, {
        status: newStatus,
        lastUpdated: Date.now(),
      })

      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus, lastUpdated: Date.now() } : app,
        ),
      )

      toast({
        title: "Status updated",
        description: "Application status has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the application status",
        variant: "destructive",
      })
    }
  }

  const filteredApplications =
    selectedJob === "all" ? applications : applications.filter((app) => app.jobId === selectedJob)

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ["pending", "reviewed", "interview", "rejected", "accepted"]
    return allStatuses.filter((status) => status !== currentStatus)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Applications</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full mb-4" />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Applications</h1>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">You haven't posted any jobs yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            {["all", "pending", "reviewed", "interview", "accepted", "rejected"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                {filteredApplications.filter((app) => tab === "all" || app.status === tab).length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">No applications found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications
                      .filter((app) => tab === "all" || app.status === tab)
                      .map((application) => (
                        <Card key={application.id}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                              <div>
                                <CardTitle>{application.jobTitle}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <Building2 className="h-4 w-4 mr-1" />
                                  {application.companyName}
                                </CardDescription>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Badge className="self-start">
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                                <Select onValueChange={(value) => updateApplicationStatus(application.id, value)}>
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Update status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getStatusOptions(application.status).map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h3 className="text-sm font-medium mb-2">Applicant Information</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 mr-2" />
                                    {application.userName}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {application.userEmail}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {application.phoneNumber}
                                  </div>
                                  {application.resumeUrl && (
                                    <div className="flex items-center text-sm">
                                      <FileText className="h-4 w-4 mr-2" />
                                      <a
                                        href={application.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        View Resume
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium mb-2">Application Details</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-2">Cover Letter</h3>
                              <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">
                                {application.coverLetter}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  )
}

