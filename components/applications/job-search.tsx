"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Building } from "lucide-react"

export function JobSearch({ onJobSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Startup Inc",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $150k",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Digital Solutions",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $130k",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$110k - $160k",
    },
    {
      id: 5,
      title: "UX/UI Designer",
      company: "Creative Agency",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$85k - $120k",
    },
    {
      id: 6,
      title: "Product Manager",
      company: "Product Labs",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$100k - $140k",
    },
    {
      id: 7,
      title: "Data Scientist",
      company: "Data Insights",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$115k - $170k",
    },
    {
      id: 8,
      title: "Mobile Developer",
      company: "App Factory",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$95k - $140k",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onJobSelect(job)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{job.type}</div>
                <div className="text-sm text-muted-foreground">{job.salary}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

