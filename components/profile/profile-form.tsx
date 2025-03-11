"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveProfile, getProfile, type UserProfile } from "@/lib/profile-service"
import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  github: z.string().url("Invalid GitHub URL").optional(),
  portfolio: z.string().url("Invalid portfolio URL").optional(),
  currentSalary: z.string().min(1, "Current salary is required"),
  expectedSalaryMin: z.string().min(1, "Minimum expected salary is required"),
  expectedSalaryMax: z.string().min(1, "Maximum expected salary is required"),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      // Calculate experience string based on form data
      const experience = `${data.currentSalary ? `Current salary: $${data.currentSalary}, ` : ""}${
        data.expectedSalaryMin && data.expectedSalaryMax
          ? `Expected salary range: $${data.expectedSalaryMin}-${data.expectedSalaryMax}`
          : ""
      }`

      // Create profile object
      const profileData: UserProfile = {
        ...data,
        skills: [], // This would be populated from a skills input component
        experience,
        resumeUrl: undefined, // This would be set by the resume upload component
      }

      // Save profile data
      saveProfile(profileData)

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

  useEffect(() => {
    const savedProfile = getProfile()
    if (savedProfile) {
      form.reset({
        fullName: savedProfile.fullName,
        email: savedProfile.email,
        phone: savedProfile.phone,
        location: savedProfile.location,
        bio: savedProfile.bio || "",
        linkedin: savedProfile.linkedin || "",
        github: savedProfile.github || "",
        portfolio: savedProfile.portfolio || "",
        currentSalary: savedProfile.currentSalary,
        expectedSalaryMin: savedProfile.expectedSalaryMin,
        expectedSalaryMax: savedProfile.expectedSalaryMax,
      })
    }
  }, [form])

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 sm:h-10 text-base" />
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
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="h-12 sm:h-10 text-base" />
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
                  <FormLabel className="text-base">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" className="h-12 sm:h-10 text-base" />
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
                  <FormLabel className="text-base">Location</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 sm:h-10 text-base" />
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
                <FormLabel className="text-base">Professional Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} className="min-h-[120px] text-base" />
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

          <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-base">
            Save Profile
          </Button>
        </form>
      </Form>
    </Card>
  )
}

