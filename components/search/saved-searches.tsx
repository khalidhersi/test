"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X } from "lucide-react"

const savedSearches = [
  {
    id: 1,
    title: "Senior React Developer",
    location: "San Francisco",
    filters: ["Remote", "Full-time", "$120k+"],
    notifications: true,
  },
  {
    id: 2,
    title: "Product Manager",
    location: "New York",
    filters: ["On-site", "5+ years", "$100k+"],
    notifications: false,
  },
]

export function SavedSearches() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Saved Searches</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
          <DialogDescription>View and manage your saved job searches</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <Card key={search.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium">{search.title}</h4>
                  <p className="text-sm text-muted-foreground">{search.location}</p>
                  <div className="flex flex-wrap gap-2">
                    {search.filters.map((filter) => (
                      <Badge key={filter} variant="secondary">
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className={search.notifications ? "text-primary" : ""}>
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

