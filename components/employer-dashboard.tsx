"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmployerDashboard() {
  const { profile } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Manage your company information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {profile?.companyName
                ? `Company: ${profile.companyName}`
                : "Complete your company profile to attract candidates"}
            </p>
            <Button asChild>
              <Link href="/employer/profile">{profile?.companyName ? "Edit Profile" : "Complete Profile"}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
            <CardDescription>Manage your job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button asChild>
                <Link href="/employer/jobs">View All Jobs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/employer/jobs/post">Post New Job</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Review candidate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/employer/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

