"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveProfile, getProfile } from "@/lib/profile-service"
import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { ResumeUploadSection } from "@/components/resume-upload-section"

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().optional().default(""),
  title: z.string().optional().default(""),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().default(""),
  github: z.string().url("Invalid GitHub URL").optional().default(""),
  portfolio: z.string().url("Invalid portfolio URL").optional().default(""),
  currentSalary: z.string().optional().default(""),
  expectedSalaryMin: z.string().optional().default(""),
  expectedSalaryMax: z.string().optional().default(""),
  education: z
    .object({
      degree: z.string().optional().default(""),
      school: z.string().optional().default(""),
      year: z.string().optional().default(""),
    })
    .optional()
    .default({}),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const defaultValues: ProfileFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  title: "",
  linkedin: "",
  github: "",
  portfolio: "",
  currentSalary: "",
  expectedSalaryMin: "",
  expectedSalaryMax: "",
  education: {
    degree: "",
    school: "",
    year: "",
  },
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues, // Set default values when initializing the form
  })

  useEffect(() => {
    const savedProfile = getProfile()
    if (savedProfile) {
      form.reset({
        fullName: savedProfile.fullName || "",
        email: savedProfile.email || "",
        phone: savedProfile.phone || "",
        location: savedProfile.location || "",
        bio: savedProfile.bio || "",
        title: savedProfile.title || "",
        linkedin: savedProfile.linkedin || "",
        github: savedProfile.github || "",
        portfolio: savedProfile.portfolio || "",
        currentSalary: savedProfile.currentSalary || "",
        expectedSalaryMin: savedProfile.expectedSalaryMin || "",
        expectedSalaryMax: savedProfile.expectedSalaryMax || "",
        education: savedProfile.education || { degree: "", school: "", year: "" },
      })
    }
  }, [form])

  function onSubmit(data: ProfileFormValues) {
    try {
      saveProfile({
        ...data,
        skills: [], // This would be populated from a skills input component
        experience: "", // This would be calculated or input separately
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a brief professional summary..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Salary Information</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="currentSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Salary</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                          <Input {...field} className="pl-6" placeholder="75,000" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedSalaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Salary (Min)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                          <Input {...field} className="pl-6" placeholder="85,000" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedSalaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Salary (Max)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                          <Input {...field} className="pl-6" placeholder="120,000" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit">Save Profile</Button>
          </form>
        </Form>
      </Card>

      <ResumeUploadSection showProfileOption={true} />
    </div>
  )
}

