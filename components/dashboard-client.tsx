"use client"

import { useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentApplications } from "@/components/recent-applications"
import { ProfileCompletion } from "@/components/profile-completion"
import { JobRecommendations } from "@/components/job-recommendations"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, BarChart3, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("DashboardClient component mounted")
  }, [])

  if (!mounted) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Dashboard (Client)</h1>
          <Link href="/search">
            <Button size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-5 w-5" />
              Search Jobs
            </Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Profile and Applications */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <ProfileCompletion />
          <RecentApplications />
        </div>

        {/* Job Recommendations */}
        <div className="mb-8">
          <JobRecommendations />
        </div>

        {/* Progress Section */}
        <div id="progress-section" className="mb-8 w-full block">
          <h2 className="text-2xl font-bold mb-6 border-t pt-8">Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/applications" className="block">
              <Card className="hover:border-primary transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                  <Briefcase className="h-10 w-10 mb-4 text-primary" />
                  <span className="text-xl font-medium">Applications</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/analytics" className="block">
              <Card className="hover:border-primary transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                  <BarChart3 className="h-10 w-10 mb-4 text-primary" />
                  <span className="text-xl font-medium">Analytics</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

