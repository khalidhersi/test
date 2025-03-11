"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

const experienceSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(50, "Please provide a detailed description"),
})

interface ExperienceProps {
  data: any
  onChange: (data: any) => void
}

export function Experience({ data, onChange }: ExperienceProps) {
  const [experiences, setExperiences] = useState(data?.experiences || [])

  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
  })

  function onSubmit(values: z.infer<typeof experienceSchema>) {
    const updatedExperiences = [...experiences, values]
    setExperiences(updatedExperiences)
    onChange({ experiences: updatedExperiences })
    form.reset()
  }

  function removeExperience(index: number) {
    const updatedExperiences = experiences.filter((_, i) => i !== index)
    setExperiences(updatedExperiences)
    onChange({ experiences: updatedExperiences })
  }

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <Card key={index} className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => removeExperience(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h4 className="font-medium">{exp.position}</h4>
            <p className="text-sm text-muted-foreground">{exp.company}</p>
            <p className="text-sm">
              {exp.startDate} - {exp.endDate || "Present"}
            </p>
            <p className="text-sm">{exp.description}</p>
          </div>
        </Card>
      ))}

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

