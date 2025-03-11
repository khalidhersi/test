"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

const notificationSchema = z.object({
  applicationUpdates: z.boolean(),
  jobRecommendations: z.boolean(),
  marketingEmails: z.boolean(),
  applicationReminders: z.boolean(),
  successStories: z.boolean(),
})

export function NotificationSettings() {
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      applicationUpdates: true,
      jobRecommendations: true,
      marketingEmails: false,
      applicationReminders: true,
      successStories: false,
    },
  })

  function onSubmit(data: z.infer<typeof notificationSchema>) {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully.",
    })
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="applicationUpdates"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Application Updates</FormLabel>
                    <FormDescription>Receive notifications about your job application status</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobRecommendations"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Job Recommendations</FormLabel>
                    <FormDescription>Get personalized job recommendations based on your profile</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationReminders"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Application Reminders</FormLabel>
                    <FormDescription>Receive reminders about incomplete applications</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="successStories"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Success Stories</FormLabel>
                    <FormDescription>Get inspired by success stories from other job seekers</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Marketing Emails</FormLabel>
                    <FormDescription>Receive updates about new features and promotions</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Preferences</Button>
        </form>
      </Form>
    </Card>
  )
}

