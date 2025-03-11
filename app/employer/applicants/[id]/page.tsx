"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Loader2,
  Calendar,
  FileText,
  Mail,
  Phone,
  AlertCircle,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import {
  type JobApplication,
  type ApplicationStatus,
  getApplication,
  getJob,
  updateApplicationStatus,
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

export default function ApplicantDetail() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [job, setJob] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [status, setStatus] = useState<ApplicationStatus>("new")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!user || !applicationId) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch application
        const applicationData = await getApplication(applicationId)

        if (!applicationData) {
          setError("Application not found")
          return
        }

        setApplication(applicationData)
        setStatus(applicationData.status)
        setNotes(applicationData.notes || "")

        // Fetch job
        const jobData = await getJob(applicationData.jobId)
        setJob(jobData)
      } catch (err) {
        console.error("Error fetching application:", err)
        setError("Failed to load application")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, applicationId])

  const handleUpdateStatus = async () => {
    if (!application) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      await updateApplicationStatus(application.id, status, notes)

      // Update local state
      setApplication((prev) => (prev ? { ...prev, status, notes } : null))

      setSuccess("Application status updated successfully")
    } catch (err) {
      console.error("Error updating application status:", err)
      setError("Failed to update application status")
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading application...
        </div>
      </div>
    )
  }

  if (!application || !job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/employer/applicants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applicants
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>
              The application you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/employer/applicants">View All Applicants</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { bg, text } = statusColors[application.status]
  const statusIcon = statusIcons[application.status]

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/employer/applicants">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applicants
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{application.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Applied for: {job.title}
                  </CardDescription>
                </div>
                <Badge className={`${bg} ${text} self-start`}>
                  <span className="flex items-center gap-1">
                    {statusIcon}
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{application.email}</span>
                </div>
                {application.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{application.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Applied: {formatDate(application.createdAt)}</span>
                </div>
                {application.resumeUrl && (
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
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
                <div>
                  <h3 className="text-lg font-medium mb-2">Cover Letter</h3>
                  <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">{application.coverLetter}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{job.title}</h3>
                <p className="text-muted-foreground">
                  {job.company} • {job.location}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements && (
                <div className="space-y-2">
                  <h4 className="font-medium">Requirements</h4>
                  <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the application status and add notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Application Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ApplicationStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add private notes about this applicant..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {success}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateStatus}
                disabled={saving || (status === application.status && notes === application.notes)}
                className="w-full"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Application
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`mailto:${application.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Candidate
                </Link>
              </Button>

              {application.phone && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`tel:${application.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Candidate
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

