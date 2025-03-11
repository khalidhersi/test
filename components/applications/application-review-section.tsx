"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface ReviewSectionProps {
  title: string
  content: string
  onEdit: () => void
}

export function ApplicationReviewSection({ title, content, onEdit }: ReviewSectionProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[200px] overflow-y-auto">{content}</div>
    </Card>
  )
}

