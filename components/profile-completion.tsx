import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function ProfileCompletion() {
  const profileItems = [
    { name: "Personal Info", completed: true },
    { name: "Work Experience", completed: true },
    { name: "Education", completed: true },
    { name: "Skills", completed: false },
    { name: "Resume Upload", completed: false },
  ]

  const completedCount = profileItems.filter((item) => item.completed).length
  const completionPercentage = (completedCount / profileItems.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>Complete your profile to improve matching</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} />
        </div>
        <div className="space-y-2">
          {profileItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">{item.name}</span>
              </div>
              {!item.completed && (
                <Button variant="ghost" size="sm">
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

