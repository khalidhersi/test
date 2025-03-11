"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Wand2 } from "lucide-react"

const coverLetterSchema = z.object({
  content: z.string().min(200, "Cover letter should be at least 200 characters"),
})

interface CoverLetterProps {
  data: any
  job: any
  onChange: (data: any) => void
}

export function CoverLetter({ data, job, onChange }: CoverLetterProps) {
  const form = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      content: data?.coverLetter || "",
    },
  })

  function onSubmit(values: z.infer<typeof coverLetterSchema>) {
    onChange({ coverLetter: values.content })
  }

  async function generateCoverLetter() {
    // TODO: Implement AI-powered cover letter generation
    const generatedContent = "Generated cover letter content..."
    form.setValue("content", generatedContent)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Job Details</h3>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Company: {job?.company}</p>
            <p>Position: {job?.title}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={12} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit">Save Cover Letter</Button>
              <Button type="button" variant="outline" onClick={generateCoverLetter}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

