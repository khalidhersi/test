"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

const tourSteps = [
  {
    target: "[data-tour='dashboard']",
    title: "Welcome to JobAI",
    content: "This is your personalized dashboard where you can track all your job applications.",
    placement: "bottom",
  },
  {
    target: "[data-tour='search']",
    title: "Smart Job Search",
    content: "Use our AI-powered job search to find the perfect opportunities matching your profile.",
    placement: "bottom",
  },
  {
    target: "[data-tour='applications']",
    title: "Application Tracking",
    content: "Keep track of all your applications and their status in one place.",
    placement: "right",
  },
  {
    target: "[data-tour='profile']",
    title: "Your Profile",
    content: "Complete your profile to get better job matches and enable one-click applications.",
    placement: "left",
  },
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour")
    if (!hasSeenTour) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenTour", "true")
  }

  if (!isVisible) return null

  const currentTarget = document.querySelector(tourSteps[currentStep].target)
  if (!currentTarget) return null

  const { top, left, height, width } = currentTarget.getBoundingClientRect()

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />

      {/* Highlight current element */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: top - 4,
          left: left - 4,
          width: width + 8,
          height: height + 8,
        }}
      >
        <div className="absolute inset-0 border-2 border-primary rounded-lg" />
      </div>

      {/* Tour card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-50"
          style={{
            top: top + height + 16,
            left: left,
          }}
        >
          <Card className="p-6 w-[320px] shadow-lg">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleComplete}>
              <X className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-lg mb-2">{tourSteps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{tourSteps[currentStep].content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", i === currentStep ? "bg-primary" : "bg-muted")} />
                ))}
              </div>
              <Button onClick={handleNext}>{currentStep === tourSteps.length - 1 ? "Finish" : "Next"}</Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

