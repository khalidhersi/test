import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentApplications() {
  const applications = [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      status: "Completed",
      date: "2024-02-25",
    },
    {
      company: "Startup Inc",
      position: "Full Stack Engineer",
      status: "In Progress",
      date: "2024-02-24",
    },
    {
      company: "Big Enterprise",
      position: "Software Architect",
      status: "Failed",
      date: "2024-02-23",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your latest job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-2"
            >
              <div>
                <h3 className="font-medium">{app.company}</h3>
                <p className="text-sm text-muted-foreground">{app.position}</p>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <Badge
                  variant={
                    app.status === "Completed" ? "default" : app.status === "In Progress" ? "secondary" : "destructive"
                  }
                >
                  {app.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{app.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

