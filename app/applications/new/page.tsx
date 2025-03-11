"use client"

import { useState } from "react"
import { ApplicationWizard } from "@/components/applications/application-wizard"
import { JobSearch } from "@/components/applications/job-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewApplicationPage() {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">New Application</h1>

      <Tabs defaultValue="wizard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="wizard">Application Wizard</TabsTrigger>
          <TabsTrigger value="search">Job Search</TabsTrigger>
        </TabsList>

        <TabsContent value="wizard">
          <ApplicationWizard selectedJob={selectedJob} />
        </TabsContent>

        <TabsContent value="search">
          <JobSearch onJobSelect={setSelectedJob} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

