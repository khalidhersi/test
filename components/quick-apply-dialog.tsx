"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDialogDesc,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  Wand2,
  AlertCircle,
  ArrowRight,
  Edit,
  DollarSign,
  CheckCircle2,
  CircleXIcon as XCircle2,
  X,
  FileText,
  Upload,
} from "lucide-react"
import { generateApplicationContent, analyzeSalaryAndSkills } from "@/lib/ai-service"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Job } from "@/lib/job-service"
import { Input } from "@/components/ui/input"
import { ResumeUploadSection } from "@/components/resume-upload-section"

interface QuickApplyDialogProps {
  job: Job
}

interface SkillsAnalysis {
  matching: string[]
  missing: string[]
  recommendations: string[]
  relevanceScore: number
  additionalSkills?: string[]
}

interface UserProfile {
  fullName: string
  experience: string
  skills: string[]
  currentSalary: string
  expectedSalaryRange: string
  resumeUrl?: string // Add this
  email: string
  phone: string
  location: string
}

// Function to retrieve profile from localStorage
const getProfile = (): UserProfile | null => {
  try {
    const profile = localStorage.getItem("userProfile")
    return profile ? JSON.parse(profile) : null
  } catch (error) {
    console.error("Error retrieving profile from localStorage:", error)
    return null
  }
}

export function QuickApplyDialog({ job }: QuickApplyDialogProps) {
  // First declare userProfile state so it can be used by other states
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = getProfile()
    return (
      savedProfile || {
        fullName: "",
        experience: "",
        skills: [],
        currentSalary: "",
        expectedSalaryRange: "",
        email: "",
        phone: "",
        location: "",
      }
    )
  })

  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("cover-letter")
  const [showReview, setShowReview] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [applicationData, setApplicationData] = useState<{
    coverLetter: string
    achievements: string
    screeningAnswers: string
    salaryNotes?: string
    skillsNotes?: string
  }>({
    coverLetter: "",
    achievements: "",
    screeningAnswers: "",
    salaryNotes: "",
    skillsNotes: "",
  })
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [newSkill, setNewSkill] = useState("")
  // Now we can safely use userProfile in the resumeUrl initialization
  const [resumeUrl, setResumeUrl] = useState<string | null>(userProfile?.resumeUrl || null)

  const { toast } = useToast()

  // Add useEffect to update profile when it changes
  useEffect(() => {
    const savedProfile = getProfile()
    if (savedProfile) {
      setUserProfile(savedProfile)
    }
  }, [])

  const handleAutoFill = async () => {
    setIsLoading(true)
    try {
      const [applicationContent, analysis] = await Promise.all([
        generateApplicationContent(job.description, userProfile),
        analyzeSalaryAndSkills(job.description, userProfile),
      ])

      setApplicationData(applicationContent)
      setAnalysisData(analysis)
      setHasChanges(true)

      // Remove the toast and showReview setting
      // Let user continue editing in current tab
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate content. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!resumeUrl) {
      toast({
        variant: "destructive",
        title: "Resume Required",
        description: "Please upload a resume or use your profile resume before submitting.",
      })
      return
    }
    // Remove the profile resume check since we now have direct upload
    setIsLoading(true)
    try {
      // Create a submission object using the state values
      const submissionData = {
        coverLetter: applicationData.coverLetter || "",
        achievements: applicationData.achievements || "",
        screeningAnswers: applicationData.screeningAnswers || "",
        salaryNotes: applicationData.salaryNotes || "",
        skillsNotes: applicationData.skillsNotes || "",
        resumeUrl: userProfile.resumeUrl, // This will include either profile resume or newly uploaded resume
        analysis: {
          salary: analysisData?.salary || null,
          skills: analysisData?.skills || null,
        },
      }

      // Validate that we have the minimum required content
      if (!submissionData.resumeUrl) {
        toast({
          variant: "destructive",
          title: "Resume Required",
          description: "Please upload a resume before submitting.",
        })
        return
      }

      if (!submissionData.coverLetter.trim()) {
        toast({
          variant: "destructive",
          title: "Cover Letter Required",
          description: "Please provide a cover letter before submitting.",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Application Submitted!",
        description: "Your application has been successfully submitted.",
      })

      // Reset states after successful submission
      setHasChanges(false)
      setIsOpen(false)
      setApplicationData({
        coverLetter: "",
        achievements: "",
        screeningAnswers: "",
        salaryNotes: "",
        skillsNotes: "",
      })
      setAnalysisData(null)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (section: string) => {
    setShowReview(false)
    setCurrentTab(section)
  }

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmClose(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleConfirmClose = () => {
    setShowConfirmClose(false)
    setIsOpen(false)
    // Reset all states
    setApplicationData({
      coverLetter: "",
      achievements: "",
      screeningAnswers: "",
      salaryNotes: "",
      skillsNotes: "",
    })
    setAnalysisData(null)
    setShowReview(false)
    setCurrentTab("cover-letter")
    setHasChanges(false)
  }

  const handleContentChange = (key: keyof typeof applicationData, value: string) => {
    setApplicationData((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const renderReviewSection = (title: string, content: string, tabKey: string) => (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => handleEdit(tabKey)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[200px] overflow-y-auto">{content}</div>
    </Card>
  )

  const handleAddSkill = () => {
    if (!newSkill.trim() || !analysisData?.skills) return

    const updatedSkills = {
      ...analysisData.skills,
      additionalSkills: [...(analysisData.skills.additionalSkills || []), newSkill.trim()],
    }

    // Update relevance score based on new skills
    const matchingAdditionalSkills = updatedSkills.additionalSkills.filter((skill) =>
      job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
    ).length

    const totalSkills =
      updatedSkills.matching.length + updatedSkills.missing.length + updatedSkills.additionalSkills.length

    const newScore = Math.round(((updatedSkills.matching.length + matchingAdditionalSkills) / totalSkills) * 100)

    setAnalysisData({
      ...analysisData,
      skills: {
        ...updatedSkills,
        relevanceScore: newScore,
      },
    })

    setNewSkill("")
    setHasChanges(true)
  }

  const handleRemoveAdditionalSkill = (skillToRemove: string) => {
    if (!analysisData?.skills) return

    const updatedSkills = {
      ...analysisData.skills,
      additionalSkills: (analysisData.skills.additionalSkills || []).filter((skill) => skill !== skillToRemove),
    }

    // Update relevance score after removing skill
    const matchingAdditionalSkills = updatedSkills.additionalSkills.filter((skill) =>
      job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
    ).length

    const totalSkills =
      updatedSkills.matching.length + updatedSkills.missing.length + updatedSkills.additionalSkills.length

    const newScore =
      totalSkills === 0
        ? 0
        : Math.round(((updatedSkills.matching.length + matchingAdditionalSkills) / totalSkills) * 100)

    setAnalysisData({
      ...analysisData,
      skills: {
        ...updatedSkills,
        relevanceScore: newScore,
      },
    })

    setHasChanges(true)
  }

  const renderSkillsSection = () => {
    if (!analysisData?.skills) return null

    const matchingAdditionalSkills =
      analysisData.skills.additionalSkills?.filter((skill) =>
        job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
      ) || []

    const otherAdditionalSkills =
      analysisData.skills.additionalSkills?.filter(
        (skill) => !job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
      ) || []

    return (
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">Skills Match</h3>
          <Badge variant={analysisData.skills.relevanceScore >= 80 ? "default" : "secondary"}>
            {analysisData.skills.relevanceScore}% Match
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Matching Skills</h4>
            <div className="flex flex-wrap gap-2">
              {analysisData.skills.matching.map((skill) => (
                <Badge key={skill} variant="outline" className="border-green-500">
                  {skill}
                </Badge>
              ))}
              {matchingAdditionalSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-green-500 border-dashed">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          {otherAdditionalSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Additional Skills</h4>
              <div className="flex flex-wrap gap-2">
                {otherAdditionalSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-primary border-dashed">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {applicationData.skillsNotes && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{applicationData.skillsNotes}</p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  const renderSalarySection = () => {
    if (!analysisData?.salary) return null

    return (
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">Salary Analysis</h3>
          <Badge variant="secondary">
            <DollarSign className="mr-1 h-4 w-4" />
            {analysisData.salary.recommendedRange}
          </Badge>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{analysisData.salary.marketContext}</p>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Contributing Factors</h4>
            <ul className="space-y-1">
              {analysisData.salary.factors.map((factor: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {factor}
                </li>
              ))}
            </ul>
          </div>

          {applicationData.salaryNotes && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Your Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{applicationData.salaryNotes}</p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  const ResumeSection = ({ resumeUrl }: { resumeUrl?: string }) => {
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

  const textareaProps = {
    className: "min-h-[200px] sm:min-h-[300px] text-base",
  }

  const inputProps = {
    className: "h-12 sm:h-10 text-base",
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Quick Apply</Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-3xl h-[90vh] w-[95vw] sm:w-[90vw] p-4 sm:p-6 rounded-t-lg sm:rounded-lg flex flex-col"
          onInteractOutside={(e) => {
            e.preventDefault()
            handleClose()
          }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Quick Apply - {job.title}</DialogTitle>
            <DialogDescription className="text-sm">{job.company}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4 flex-1 overflow-y-auto">
            {!showReview && (
              <Button
                variant="outline"
                onClick={handleAutoFill}
                disabled={isLoading}
                className="w-full h-12 sm:h-10 text-base"
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                Auto-fill with AI
              </Button>
            )}

            {showReview ? (
              <div className="space-y-6 h-full overflow-y-auto">
                {/* Resume section with upload option */}
                <div className="space-y-2">
                  <h3 className="font-medium">Resume</h3>
                  <ResumeUploadSection
                    defaultResumeUrl={userProfile.resumeUrl}
                    onResumeChange={(url) => {
                      setResumeUrl(url)
                      if (url) {
                        // Update the profile with the new resume URL
                        setUserProfile({ ...userProfile, resumeUrl: url })
                      }
                    }}
                    showProfileOption={true}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Review Your Application</AlertTitle>
                  <AlertDescription>Please review all sections before submitting your application.</AlertDescription>
                </Alert>

                <div className="space-y-4 pb-20">
                  {/* Resume section with upload option */}
                  {/* <div className="space-y-2">
                    <h3 className="font-medium">Resume</h3>
                    <ResumeUploadSection
                      defaultResumeUrl={userProfile.resumeUrl}
                      onResumeChange={(url) => {
                        if (url) {
                          setUserProfile({ ...userProfile, resumeUrl: url })
                        }
                      }}
                    />
                  </div> */}

                  {renderReviewSection("Cover Letter", applicationData.coverLetter, "cover-letter")}
                  {renderReviewSection("Key Achievements", applicationData.achievements, "achievements")}
                  {renderReviewSection("Screening Questions", applicationData.screeningAnswers, "screening")}

                  {analysisData && (
                    <>
                      {renderSalarySection()}
                      {renderSkillsSection()}
                    </>
                  )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowReview(false)} className="w-full sm:w-auto">
                    Edit Application
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Submit Application
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-5">
                  <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="screening" className="hidden sm:block">
                    Screening
                  </TabsTrigger>
                  <TabsTrigger value="salary" className="hidden sm:block">
                    Salary
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="hidden sm:block">
                    Skills
                  </TabsTrigger>
                </TabsList>
                <div className="block sm:hidden mt-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="screening">Screening</TabsTrigger>
                    <TabsTrigger value="salary">Salary</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="cover-letter" className="space-y-4">
                  <Card className="p-3 sm:p-4">
                    <Textarea
                      placeholder="Write your cover letter here..."
                      value={applicationData.coverLetter}
                      onChange={(e) => handleContentChange("coverLetter", e.target.value)}
                      className="min-h-[200px] sm:min-h-[300px] text-base"
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <Card className="p-3 sm:p-4">
                    <Textarea
                      placeholder="List your key achievements..."
                      value={applicationData.achievements}
                      onChange={(e) => handleContentChange("achievements", e.target.value)}
                      className="min-h-[200px] sm:min-h-[300px] text-base"
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="screening" className="space-y-4">
                  <Card className="p-3 sm:p-4">
                    <Textarea
                      placeholder="Answer screening questions..."
                      value={applicationData.screeningAnswers}
                      onChange={(e) => handleContentChange("screeningAnswers", e.target.value)}
                      className="min-h-[200px] sm:min-h-[300px] text-base"
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="salary" className="space-y-4">
                  <Card className="p-6">
                    {analysisData?.salary ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Recommended Salary Range</h3>
                          <Badge variant="secondary">
                            <DollarSign className="mr-1 h-4 w-4" />
                            {analysisData.salary.recommendedRange}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{analysisData.salary.marketContext}</p>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Contributing Factors</h4>
                          <ul className="space-y-1">
                            {analysisData.salary.factors.map((factor: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {factor}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Textarea
                          placeholder="Add your salary notes and requirements..."
                          value={applicationData.salaryNotes || ""}
                          onChange={(e) => handleContentChange("salaryNotes", e.target.value)}
                          className="min-h-[200px] sm:min-h-[300px] text-base mt-4"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Click "Auto-fill with AI" to analyze salary expectations
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <Card className="p-6">
                    {analysisData?.skills ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Skills Match</h3>
                            <Badge variant={analysisData.skills.relevanceScore >= 80 ? "default" : "secondary"}>
                              {analysisData.skills.relevanceScore}% Match
                            </Badge>
                          </div>
                          <Progress value={analysisData.skills.relevanceScore} />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisData.skills.matching.map((skill: string) => (
                                <Badge key={skill} variant="outline" className="border-green-500">
                                  {skill}
                                </Badge>
                              ))}
                              {/* Show additional skills that match job requirements */}
                              {analysisData.skills.additionalSkills
                                ?.filter((skill: string) =>
                                  job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
                                )
                                .map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="border-green-500 border-dashed">
                                    {skill}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => handleRemoveAdditionalSkill(skill)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <XCircle2 className="mr-2 h-4 w-4 text-yellow-500" />
                              Skills to Develop
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisData.skills.missing.map((skill: string) => (
                                <Badge key={skill} variant="outline" className="border-yellow-500">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Additional Skills</h4>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add a skill..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddSkill()
                                  }
                                }}
                                {...inputProps}
                              />
                              <Button variant="outline" size="sm" onClick={handleAddSkill} disabled={!newSkill.trim()}>
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {analysisData.skills.additionalSkills
                                ?.filter(
                                  (skill: string) =>
                                    !job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
                                )
                                .map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="border-primary border-dashed">
                                    {skill}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => handleRemoveAdditionalSkill(skill)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Notes</h4>
                            <Textarea
                              placeholder="Add any notes about your skills or experience..."
                              value={applicationData.skillsNotes || ""}
                              onChange={(e) => handleContentChange("skillsNotes", e.target.value)}
                              className="min-h-[200px] sm:min-h-[300px] text-base"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Click "Auto-fill with AI" to analyze skills match
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setShowReview(true)} disabled={isLoading}>
                    Review Application
                  </Button>
                </div>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDesc>
              You have unsaved changes. If you close now, all your progress will be lost.
            </AlertDialogDesc>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

