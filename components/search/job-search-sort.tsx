"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobSearchSortProps {
  totalJobs: number
  onSortChange: (sortBy: string) => void
  isLoading: boolean
}

export function JobSearchSort({ totalJobs, onSortChange, isLoading }: JobSearchSortProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {isLoading ? (
          "Searching jobs..."
        ) : (
          <>
            Showing <strong>{totalJobs}</strong> jobs
          </>
        )}
      </p>
      <Select defaultValue="relevant" onValueChange={onSortChange} disabled={isLoading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevant">Most Relevant</SelectItem>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="salary-high">Highest Salary</SelectItem>
          <SelectItem value="salary-low">Lowest Salary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

