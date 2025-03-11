"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { JobSearchParams } from "@/lib/job-service"

interface JobSearchFiltersProps {
  onFilterChange: (filters: JobSearchParams) => void
  isLoading: boolean
}

export function JobSearchFilters({ onFilterChange, isLoading }: JobSearchFiltersProps) {
  const [location, setLocation] = useState("")
  const [remote, setRemote] = useState(false)
  const [experienceLevel, setExperienceLevel] = useState<string[]>([])
  const [jobType, setJobType] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 150000])
  const [shouldUpdateFilters, setShouldUpdateFilters] = useState(false)
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(["experience"])

  // Use a separate effect to batch filter changes and prevent excessive updates
  useEffect(() => {
    // Skip the initial render
    if (shouldUpdateFilters) {
      const filters: JobSearchParams = {
        location: location || undefined,
        remote: remote || undefined,
        experienceLevel: experienceLevel.length > 0 ? experienceLevel : undefined,
        jobType: jobType.length > 0 ? jobType : undefined,
        salary: salaryRange,
      }

      onFilterChange(filters)
    }
  }, [shouldUpdateFilters, location, remote, experienceLevel, jobType, salaryRange, onFilterChange])

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setExperienceLevel((prev) => [...prev, level])
    } else {
      setExperienceLevel((prev) => prev.filter((l) => l !== level))
    }
  }

  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setJobType((prev) => [...prev, type])
    } else {
      setJobType((prev) => prev.filter((t) => t !== type))
    }
  }

  const handleApplyFilters = () => {
    setShouldUpdateFilters(true)
  }

  const handleResetFilters = () => {
    setLocation("")
    setRemote(false)
    setExperienceLevel([])
    setJobType([])
    setSalaryRange([50000, 150000])

    // Update filters after reset
    setShouldUpdateFilters(true)
  }

  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  const handleAccordionChange = (value: string) => {
    if (expandedAccordions.includes(value)) {
      setExpandedAccordions(expandedAccordions.filter((item) => item !== value))
    } else {
      setExpandedAccordions([...expandedAccordions, value])
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-base">Location</h3>
          <Input
            placeholder="City, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 sm:h-10 text-base"
          />
          <div className="flex items-center space-x-3">
            <Switch
              id="remote"
              checked={remote}
              onCheckedChange={setRemote}
              className="h-6 w-11 data-[state=checked]:bg-primary"
            />
            <Label htmlFor="remote" className="text-base">
              Remote jobs only
            </Label>
          </div>
        </div>

        <Accordion
          type="multiple"
          value={expandedAccordions}
          onValueChange={(value) => setExpandedAccordions(value)}
          className="w-full"
        >
          <AccordionItem value="experience">
            <AccordionTrigger className="text-base py-4">Experience Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                  <div key={level} className="flex items-center space-x-3">
                    <Checkbox
                      id={level.toLowerCase().replace(" ", "-")}
                      checked={experienceLevel.includes(level)}
                      onCheckedChange={(checked) => handleExperienceLevelChange(level, checked as boolean)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={level.toLowerCase().replace(" ", "-")} className="text-base cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="job-type">
            <AccordionTrigger className="text-base py-4">Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {["Full-time", "Part-time", "Contract", "Temporary", "Internship"].map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={type.toLowerCase().replace(" ", "-")}
                      checked={jobType.includes(type)}
                      onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={type.toLowerCase().replace(" ", "-")} className="text-base cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="salary">
            <AccordionTrigger className="text-base py-4">Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 px-1">
                <div className="flex justify-between text-sm">
                  <span>{formatSalary(salaryRange[0])}</span>
                  <span>{formatSalary(salaryRange[1])}</span>
                </div>
                <Slider
                  defaultValue={[50000, 150000]}
                  value={salaryRange}
                  min={30000}
                  max={250000}
                  step={5000}
                  onValueChange={(value) => setSalaryRange(value as [number, number])}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 h-12 sm:h-10 text-base" onClick={handleApplyFilters} disabled={isLoading}>
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 sm:h-10 text-base"
            onClick={handleResetFilters}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}

