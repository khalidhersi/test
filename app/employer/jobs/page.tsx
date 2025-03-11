"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get, update, remove } from "firebase/database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"
import { Building2, MapPin, Clock, Users, MoreVertical, Plus, Edit, Trash, Eye, XCircle } from "lucide-react"

export default function EmployerJobsPage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      if (!user) return

      try {
        const jobsRef = ref(db, "jobs")
        const employerJobsQuery = query(jobsRef, orderByChild("employerId"), equalTo(user.uid))

        const snapshot = await get(employerJobsQuery)

        const jobsData: any[] = []
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            jobsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            })
          })

          // Sort by creation date (newest first)
          jobsData.sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0)
          })
        }

        setJobs(jobsData)
      } catch (error) {
        console.error("Error fetching employer jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmployerJobs()
  }, [user])

  // Redirect if not an employer
  useEffect(() => {
    if (!loading && userRole !== "employer") {
      router.push("/employer/upgrade")
    }
  }, [loading, userRole, router])

  const updateJobStatus = async (jobId: string, status: string) => {
    setActionLoading(true)

    try {
      const jobRef = ref(db, `jobs/${jobId}`)
      await update(jobRef, {
        status,
        updatedAt: Date.now(),
      })

      // Update local state
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status, updatedAt: Date.now() } : job)))

      toast({
        title: "Status updated",
        description: `Job has been ${status === "active" ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Error updating job status:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the job status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const deleteJob = async () => {
    if (!deleteJobId) return

    setActionLoading(true)

    try {
      const jobRef = ref(db, `jobs/${deleteJobId}`)
      await remove(jobRef)

      // Update local state
      setJobs(jobs.filter((job) => job.id !== deleteJobId))

      toast({
        title: "Job deleted",
        description: "The job has been permanently deleted",
      })
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the job",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
      setDeleteJobId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full mb-4" />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/employer/jobs/post">
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        {["all", "active", "inactive"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {jobs.filter((job) => tab === "all" || job.status === tab).length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    {tab === "all" ? "You haven't posted any jobs yet." : `You don't have any ${tab} jobs.`}
                  </p>
                  {tab === "all" && (
                    <div className="flex justify-center mt-4">
                      <Button asChild>
                        <Link href="/employer/jobs/post">
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Job
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs
                  .filter((job) => tab === "all" || job.status === tab)
                  .map((job) => (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.companyName}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(job.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/jobs/${job.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/employer/jobs/edit/${job.id}`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                {job.status === "active" ? (
                                  <DropdownMenuItem
                                    onClick={() => updateJobStatus(job.id, "inactive")}
                                    disabled={actionLoading}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => updateJobStatus(job.id, "active")}
                                    disabled={actionLoading}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => setDeleteJobId(job.id)}
                                  className="text-red-600"
                                  disabled={actionLoading}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {job.isRemote ? "Remote" : job.location || "No location specified"}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {job.applicationCount || 0} application{job.applicationCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="text-sm text-muted-foreground">
                          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/employer/applications?jobId=${job.id}`}>View Applications</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={!!deleteJobId} onOpenChange={(open) => !open && setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting and all associated
              applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteJob} disabled={actionLoading} className="bg-red-600 hover:bg-red-700">
              {actionLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

