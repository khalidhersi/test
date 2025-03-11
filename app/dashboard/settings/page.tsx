"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { ref, get, update } from "firebase/database"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { DashboardNav } from "@/components/dashboard-nav"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    resumeUrl: "",
    skills: "",
    experience: "",
    education: "",
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        router.push("/signin")
        return
      }

      try {
        // Get user profile from Firebase
        const userRef = ref(db, `users/${user.uid}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const userData = snapshot.val()
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            phoneNumber: userData.phoneNumber || "",
            location: userData.location || "",
            bio: userData.bio || "",
            resumeUrl: userData.resumeUrl || "",
            skills: userData.skills || "",
            experience: userData.experience || "",
            education: userData.education || "",
          })
        } else {
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            phoneNumber: "",
            location: "",
            bio: "",
            resumeUrl: "",
            skills: "",
            experience: "",
            education: "",
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setSaving(true)

      // Update display name in Firebase Auth
      if (profile.displayName !== user.displayName) {
        await updateUserProfile({
          displayName: profile.displayName,
        })
      }

      // Update user profile in Realtime Database
      const userRef = ref(db, `users/${user.uid}`)
      await update(userRef, {
        phoneNumber: profile.phoneNumber,
        location: profile.location,
        bio: profile.bio,
        resumeUrl: profile.resumeUrl,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        updatedAt: Date.now(),
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <div>
          <DashboardNav />
        </div>
        <div>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="resume">Resume & Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input id="displayName" name="displayName" value={profile.displayName} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={profile.email} disabled />
                      <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        value={profile.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Resume & Skills</CardTitle>
                    <CardDescription>Add your resume and professional information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl">Resume URL</Label>
                      <Input
                        id="resumeUrl"
                        name="resumeUrl"
                        placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                        value={profile.resumeUrl}
                        onChange={handleChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        Provide a link to your resume stored in a cloud service
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        placeholder="List your skills (e.g., JavaScript, React, Project Management)"
                        value={profile.skills}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Work Experience</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        placeholder="Summarize your work experience"
                        value={profile.experience}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Textarea
                        id="education"
                        name="education"
                        placeholder="List your educational background"
                        value={profile.education}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

