"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Steps } from "@/components/ui/steps"
import { PersonalInfo } from "./wizard-steps/personal-info"
import { Experience } from "./wizard-steps/experience"
import { CoverLetter } from "./wizard-steps/cover-letter"
import { Review } from "./wizard-steps/review"

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "experience", title: "Experience" },
  { id: "cover", title: "Cover Letter" },
  { id: "review", title: "Review" },
]

export function ApplicationWizard({ selectedJob }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    // Submit application logic
  }

  return (
    <Card className="p-6">
      <Steps steps={steps} currentStep={currentStep} />

      <div className="mt-8 space-y-6">
        {currentStep === 0 && (
          <PersonalInfo data={formData} onChange={(data) => setFormData({ ...formData, ...data })} />
        )}
        {currentStep === 1 && <Experience data={formData} onChange={(data) => setFormData({ ...formData, ...data })} />}
        {currentStep === 2 && (
          <CoverLetter data={formData} job={selectedJob} onChange={(data) => setFormData({ ...formData, ...data })} />
        )}
        {currentStep === 3 && <Review data={formData} job={selectedJob} />}

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit}>Submit Application</Button>
          ) : (
            <Button onClick={handleNext}>Continue</Button>
          )}
        </div>
      </div>
    </Card>
  )
}

