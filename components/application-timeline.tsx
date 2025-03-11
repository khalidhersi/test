"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Calendar, FileText, MessageSquare, X, ChevronDown, ChevronUp } from "lucide-react"

// Mock data for application timeline
const timelineData = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Senior Software Engineer",
    status: "Interview Scheduled",
    events: [
      {
        date: "2024-02-28",
        type: "interview",
        title: "Technical Interview",
        description: "Virtual technical interview with the engineering team.",
        time: "10:00 AM",
        notes: "Prepare to discuss system design and coding challenges.",
      },
      {
        date: "2024-02-25",
        type: "screening",
        title: "Phone Screening",
        description: "Initial phone screening with HR.",
        time: "2:30 PM",
        notes: "Discussed experience and salary expectations.",
      },
      {
        date: "2024-02-20",
        type: "application",
        title: "Application Submitted",
        description: "Applied for the position online.",
        time: "11:45 AM",
      },
    ],
  },
  {
    id: 2,
    company: "Startup Inc",
    position: "Full Stack Developer",
    status: "Application Submitted",
    events: [
      {
        date: "2024-02-24",
        type: "application",
        title: "Application Submitted",
        description: "Applied for the position through LinkedIn.",
        time: "3:15 PM",
      },
    ],
  },
  {
    id: 3,
    company: "Big Enterprise",
    position: "Software Architect",
    status: "Rejected",
    events: [
      {
        date: "2024-02-23",
        type: "rejected",
        title: "Application Rejected",
        description: "Received rejection email.",
        time: "9:00 AM",
        notes: "They were looking for someone with more enterprise experience.",
      },
      {
        date: "2024-02-15",
        type: "application",
        title: "Application Submitted",
        description: "Applied for the position online.",
        time: "10:30 AM",
      },
    ],
  },
]

const statusIcons = {
  "Application Submitted": <FileText className="h-5 w-5 text-blue-500" />,
  "Interview Scheduled": <Calendar className="h-5 w-5 text-green-500" />,
  "In Progress": <Clock className="h-5 w-5 text-yellow-500" />,
  Rejected: <X className="h-5 w-5 text-red-500" />,
  "Offer Received": <CheckCircle className="h-5 w-5 text-green-500" />,
}

const eventIcons = {
  application: <FileText className="h-5 w-5 text-blue-500" />,
  screening: <MessageSquare className="h-5 w-5 text-purple-500" />,
  interview: <Calendar className="h-5 w-5 text-green-500" />,
  rejected: <X className="h-5 w-5 text-red-500" />,
  offer: <CheckCircle className="h-5 w-5 text-green-500" />,
}

export function ApplicationTimeline() {
  const [expandedApplications, setExpandedApplications] = useState<number[]>([1])

  const toggleExpand = (id: number) => {
    if (expandedApplications.includes(id)) {
      setExpandedApplications(expandedApplications.filter((appId) => appId !== id))
    } else {
      setExpandedApplications([...expandedApplications, id])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {timelineData.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(application.id)}
                >
                  <div className="flex items-center gap-3">
                    {statusIcons[application.status as keyof typeof statusIcons]}
                    <div>
                      <h3 className="font-medium">{application.position}</h3>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        application.status === "Rejected"
                          ? "destructive"
                          : application.status === "Interview Scheduled"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {application.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      {expandedApplications.includes(application.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedApplications.includes(application.id) && (
                  <div className="px-4 pb-4">
                    <div className="ml-6 border-l-2 border-muted pl-6 space-y-4 pt-2">
                      {application.events.map((event, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-8 mt-1 bg-background p-1 rounded-full">
                            {eventIcons[event.type as keyof typeof eventIcons]}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(event.date)} {event.time && `at ${event.time}`}
                              </span>
                            </div>
                            <p className="text-sm">{event.description}</p>
                            {event.notes && <p className="text-sm text-muted-foreground italic">{event.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {timelineData
              .filter((app) => app.status !== "Rejected")
              .map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpand(application.id)}
                  >
                    <div className="flex items-center gap-3">
                      {statusIcons[application.status as keyof typeof statusIcons]}
                      <div>
                        <h3 className="font-medium">{application.position}</h3>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={application.status === "Interview Scheduled" ? "default" : "secondary"}>
                        {application.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        {expandedApplications.includes(application.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedApplications.includes(application.id) && (
                    <div className="px-4 pb-4">
                      <div className="ml-6 border-l-2 border-muted pl-6 space-y-4 pt-2">
                        {application.events.map((event, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-8 mt-1 bg-background p-1 rounded-full">
                              {eventIcons[event.type as keyof typeof eventIcons]}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{event.title}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(event.date)} {event.time && `at ${event.time}`}
                                </span>
                              </div>
                              <p className="text-sm">{event.description}</p>
                              {event.notes && <p className="text-sm text-muted-foreground italic">{event.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {timelineData
              .filter((app) => app.status === "Rejected")
              .map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpand(application.id)}
                  >
                    <div className="flex items-center gap-3">
                      {statusIcons[application.status as keyof typeof statusIcons]}
                      <div>
                        <h3 className="font-medium">{application.position}</h3>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">{application.status}</Badge>
                      <Button variant="ghost" size="icon">
                        {expandedApplications.includes(application.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedApplications.includes(application.id) && (
                    <div className="px-4 pb-4">
                      <div className="ml-6 border-l-2 border-muted pl-6 space-y-4 pt-2">
                        {application.events.map((event, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-8 mt-1 bg-background p-1 rounded-full">
                              {eventIcons[event.type as keyof typeof eventIcons]}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{event.title}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(event.date)} {event.time && `at ${event.time}`}
                                </span>
                              </div>
                              <p className="text-sm">{event.description}</p>
                              {event.notes && <p className="text-sm text-muted-foreground italic">{event.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

