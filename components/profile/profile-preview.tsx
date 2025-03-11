import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import { getProfile } from "@/lib/profile-service"

export function ProfilePreview() {
  // Get profile data from our profile service with default values
  const defaultProfile = {
    fullName: "",
    title: "",
    location: "",
    experience: "",
    skills: [],
    education: {
      degree: "",
      school: "",
      year: "",
    },
    currentSalary: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    bio: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resumeUrl: "",
    lastUpdated: new Date().toISOString().split("T")[0],
  }

  const savedProfile = getProfile()
  const profile = {
    ...defaultProfile,
    ...savedProfile,
    // Ensure education object exists with default values
    education: {
      ...defaultProfile.education,
      ...(savedProfile?.education || {}),
    },
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{profile.fullName || "No name provided"}</h3>
          <p className="text-muted-foreground">{profile.title || "No title provided"}</p>
          <p className="text-sm text-muted-foreground">{profile.location || "No location provided"}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Education</h4>
          <div className="space-y-1">
            {profile.education.degree || profile.education.school ? (
              <>
                <p className="font-medium">{profile.education.degree || "Degree not specified"}</p>
                <p className="text-sm text-muted-foreground">
                  {profile.education.school}
                  {profile.education.year && `, ${profile.education.year}`}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No education information added yet</p>
            )}
          </div>
        </div>

        {(profile.currentSalary || profile.expectedSalaryMin || profile.expectedSalaryMax) && (
          <div>
            <h4 className="font-medium mb-2">Salary Information</h4>
            <div className="space-y-1">
              {profile.currentSalary && (
                <p className="text-sm text-muted-foreground">Current Salary: ${profile.currentSalary}</p>
              )}
              {(profile.expectedSalaryMin || profile.expectedSalaryMax) && (
                <p className="text-sm text-muted-foreground">
                  Expected Salary Range: ${profile.expectedSalaryMin} - ${profile.expectedSalaryMax}
                </p>
              )}
            </div>
          </div>
        )}

        {(profile.linkedin || profile.github || profile.portfolio) && (
          <div>
            <h4 className="font-medium mb-2">Links</h4>
            <div className="space-y-1">
              {profile.linkedin && (
                <p className="text-sm">
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </p>
              )}
              {profile.github && (
                <p className="text-sm">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Profile
                  </a>
                </p>
              )}
              {profile.portfolio && (
                <p className="text-sm">
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Portfolio Website
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Last updated: {profile.lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  )
}

