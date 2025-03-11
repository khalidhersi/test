"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { getProfile, updateProfile } from "@/lib/profile-service"
import { useToast } from "@/components/ui/use-toast"

export function SkillsManager() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const profile = getProfile()
    if (profile && profile.skills) {
      setSkills(profile.skills)
    }
  }, [])

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    // Check if skill already exists
    if (skills.includes(newSkill.trim())) {
      toast({
        variant: "destructive",
        title: "Skill already exists",
        description: "This skill is already in your profile.",
      })
      return
    }

    const updatedSkills = [...skills, newSkill.trim()]
    setSkills(updatedSkills)
    updateProfile({ skills: updatedSkills })
    setNewSkill("")

    toast({
      title: "Skill added",
      description: "Your skills have been updated.",
    })
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(updatedSkills)
    updateProfile({ skills: updatedSkills })

    toast({
      title: "Skill removed",
      description: "Your skills have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
          <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => handleRemoveSkill(skill)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet. Add skills to improve job matching.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

