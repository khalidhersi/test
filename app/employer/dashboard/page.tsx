"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, Users, Plus, Settings } from "lucide-react"

export default function EmployerDashboardPage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [companyData, setCompanyData] = useState<any>(null)
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!user) return

      try {
        // Fetch company profile
        const companyRef = ref(db, `companies/${user.uid}`)
        const companySnapshot = await get(companyRef)

        if (companySnapshot.exists()) {
          setCompanyData(companySnapshot.val())
        }

        // Fetch job statistics
        const jobsRef = ref(db, "jobs")
        const jobsSnapshot = await get(jobsRef)

        let totalJobs = 0
        let activeJobs = 0
        let totalApplications = 0

        if (jobsSnapshot.exists()) {
          jobsSnapshot.forEach((childSnapshot) => {
            const job = childSnapshot.val()

            if (job.employerId === user.uid) {
              totalJobs++

              if (job.status === "active") {
                activeJobs++
              }

              if (job.applicationCount) {
                totalApplications += job.applicationCount
              }
            }
          })
        }

        setJobStats({
          totalJobs,
          activeJobs,
          totalApplications,
        })
      } catch (error) {
        console.error("Error fetching employer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployerData()
  }, [user])

  // Redirect if not an employer
  useEffect(() => {
    if (!loading && userRole !== "employer") {
      router.push("/employer/upgrade")
    }
  }, [loading, userRole, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/employer/jobs/post">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/employer/profile">
              <Settings className="h-4 w-4 mr-2" />
              Company Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              <div className="text-3xl font-bold">{jobStats.totalJobs}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-3xl font-bold">{jobStats.activeJobs}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <div className="text-3xl font-bold">{jobStats.totalApplications}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Your company information visible to job seekers</CardDescription>
        </CardHeader>
        <CardContent>
          {companyData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{companyData.companyName}</h3>
                <p className="text-sm text-muted-foreground">
                  {companyData.industry} · {companyData.companySize} employees
                </p>
              </div>

              {companyData.companyWebsite && (
                <div>
                  <h4 className="text-sm font-medium">Website</h4>
                  <a
                    href={companyData.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {companyData.companyWebsite}
                  </a>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium">About</h4>
                <p className="text-sm whitespace-pre-line">{companyData.companyDescription}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No company profile found. Please update your company information.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/employer/profile">Edit Company Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

