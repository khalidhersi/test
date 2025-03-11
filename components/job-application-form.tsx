"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { ref, push, serverTimestamp } from "firebase/database"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  companyName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function JobApplicationForm({ jobId, jobTitle, companyName, onSuccess, onCancel }: JobApplicationFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    coverLetter: "",
    phoneNumber: "",
    resumeUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
        variant: "destructive",
      })
      router.push("/signin")
      return
    }

    try {
      setIsSubmitting(true)

      // Create application in Firebase
      const applicationsRef = ref(db, "applications")
      await push(applicationsRef, {
        jobId,
        jobTitle,
        companyName,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        coverLetter: formData.coverLetter,
        phoneNumber: formData.phoneNumber,
        resumeUrl: formData.resumeUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for {jobTitle}</CardTitle>
        <CardDescription>at {companyName}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
              value={formData.resumeUrl}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Tell the employer why you're a good fit for this position"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

