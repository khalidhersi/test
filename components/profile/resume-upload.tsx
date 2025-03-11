"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileUp, X, FileText, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateProfile } from "@/lib/profile-service"

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // In a real app, you would upload the file to storage and get a URL back
      const mockResumeUrl = `/uploads/${file.name}`

      // Update profile with resume URL
      updateProfile({ resumeUrl: mockResumeUrl })

      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      })
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload resume. Please try again.",
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setProgress(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
            <FileUp className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop your resume here, or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOC, DOCX (up to 5MB)</p>
            <Button variant="secondary" onClick={() => document.getElementById("resume-upload")?.click()}>
              Choose File
            </Button>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploading ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
              </div>
            ) : (
              <Button className="w-full" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

