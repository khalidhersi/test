"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface ResumeSectionProps {
  resumeUrl?: string
}

export function ResumeSection({ resumeUrl }: ResumeSectionProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Attached Resume</h3>
            <p className="text-sm text-muted-foreground">
              {resumeUrl ? "Resume from your profile will be included" : "No resume attached"}
            </p>
          </div>
        </div>
        {resumeUrl ? (
          <Button variant="outline" size="sm" onClick={() => window.open(resumeUrl, "_blank")}>
            <FileText className="h-4 w-4 mr-2" />
            View Resume
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a href="/profile">
              <Upload className="h-4 w-4 mr-2" />
              Upload in Profile
            </a>
          </Button>
        )}
      </div>
    </Card>
  )
}

