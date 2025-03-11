"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { ref, push, get } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Briefcase, DollarSign, MapPin, Clock } from "lucide-react"

export default function PostJobPage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "full-time",
    category: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    isRemote: false,
    applicationEmail: "",
    applicationUrl: "",
    applicationDeadline: "",
  })

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!user) return

      try {
        const companyRef = ref(db, `companies/${user.uid}`)
        const snapshot = await get(companyRef)

        if (snapshot.exists()) {
          setCompanyData(snapshot.val())

          // Pre-fill location if company has one
          if (snapshot.val().location) {
            setFormData((prev) => ({
              ...prev,
              location: snapshot.val().location,
            }))
          }

          // Pre-fill application email with user's email
          if (user.email) {
            setFormData((prev) => ({
              ...prev,
              applicationEmail: user.email,
            }))
          }
        }
      } catch (error) {
        console.error("Error fetching company profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyProfile()
  }, [user])

  // Redirect if not an employer
  useEffect(() => {
    if (!loading && userRole !== "employer") {
      router.push("/employer/upgrade")
    }
  }, [loading, userRole, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isRemote: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      })
      return
    }

    if (!companyData) {
      toast({
        title: "Company profile required",
        description: "Please complete your company profile before posting a job",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const jobsRef = ref(db, "jobs")
      const newJobRef = await push(jobsRef, {
        ...formData,
        employerId: user.uid,
        companyName: companyData.companyName,
        companyLogo: companyData.companyLogo || "",
        companyIndustry: companyData.industry,
        companySize: companyData.companySize,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        applicationCount: 0,
      })

      toast({
        title: "Job posted",
        description: "Your job has been posted successfully",
      })

      // Redirect to job management page
      router.push("/employer/jobs")
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Posting failed",
        description: "There was an error posting your job",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the details of the job you want to post</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Job Category *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="software-development">Software Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="customer-service">Customer Service</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="engineering">Engineering</option>
                  <option value="human-resources">Human Resources</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minSalary"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    type="number"
                    min="0"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary">Maximum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxSalary"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    placeholder="e.g. 80000"
                    type="number"
                    min="0"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isRemote" checked={formData.isRemote} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isRemote">This is a remote position</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the job"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the requirements for this position"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">Separate each requirement with a new line</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities *</Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="List the responsibilities for this position"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">Separate each responsibility with a new line</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="List the benefits offered with this position"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Separate each benefit with a new line</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicationEmail">Application Email</Label>
                <Input
                  id="applicationEmail"
                  name="applicationEmail"
                  value={formData.applicationEmail}
                  onChange={handleChange}
                  placeholder="e.g. careers@company.com"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationUrl">Application URL</Label>
                <Input
                  id="applicationUrl"
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  placeholder="e.g. https://company.com/careers"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

