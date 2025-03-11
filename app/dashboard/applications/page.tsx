"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { Building2, Calendar, Clock } from "lucide-react"

export default function MyApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      try {
        const applicationsRef = ref(db, "applications")
        const userApplicationsQuery = query(applicationsRef, orderByChild("userId"), equalTo(user.uid))

        const snapshot = await get(userApplicationsQuery)

        if (snapshot.exists()) {
          const applicationsData: any[] = []
          snapshot.forEach((childSnapshot) => {
            applicationsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            })
          })

          // Sort by creation date (newest first)
          applicationsData.sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0)
          })

          setApplications(applicationsData)
        }
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full mb-4" />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending Review
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Reviewed
          </Badge>
        )
      case "interview":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Interview
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Not Selected
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">You haven't applied to any jobs yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{application.jobTitle}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      {application.companyName}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                  </div>
                  {application.lastUpdated && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Updated {formatDistanceToNow(new Date(application.lastUpdated), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

