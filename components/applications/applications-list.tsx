"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building, Calendar, MoreVertical, ExternalLink, MessageCircle, AlertCircle } from "lucide-react"

// Sample application data
const applications = [
  {
    id: 1,
    position: "Senior Software Engineer",
    company: "Tech Corp",
    status: "In Progress",
    appliedDate: "2024-02-20",
    lastUpdated: "2024-02-25",
    nextStep: "Technical Interview",
    nextStepDate: "2024-03-01",
  },
  {
    id: 2,
    position: "Product Manager",
    company: "Innovation Labs",
    status: "Submitted",
    appliedDate: "2024-02-18",
    lastUpdated: "2024-02-18",
    nextStep: "Awaiting Response",
    nextStepDate: null,
  },
  {
    id: 3,
    position: "UX Designer",
    company: "Design Studio",
    status: "Interview Scheduled",
    appliedDate: "2024-02-15",
    lastUpdated: "2024-02-24",
    nextStep: "First Interview",
    nextStepDate: "2024-02-28",
  },
  {
    id: 4,
    position: "Full Stack Developer",
    company: "Startup Inc",
    status: "Rejected",
    appliedDate: "2024-02-10",
    lastUpdated: "2024-02-22",
    nextStep: null,
    nextStepDate: null,
  },
]

const statusColors = {
  Submitted: "default",
  "In Progress": "warning",
  "Interview Scheduled": "info",
  "Offer Received": "success",
  Rejected: "destructive",
} as const

export function ApplicationsList() {
  const [sortBy, setSortBy] = useState("lastUpdated")

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-lg">{application.position}</h3>
                  <Badge variant={statusColors[application.status as keyof typeof statusColors] || "default"}>
                    {application.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {application.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Applied {application.appliedDate}
                  </span>
                </div>
              </div>

              {application.nextStep && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Next Step: {application.nextStep}</span>
                  {application.nextStepDate && <Badge variant="outline">{application.nextStepDate}</Badge>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <MessageCircle className="h-4 w-4 mr-2" />
                Follow Up
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Job
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                  <DropdownMenuItem>Add Note</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Withdraw Application</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

