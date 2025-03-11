import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Help Center</h1>

      <div className="max-w-xl mx-auto space-y-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search help articles..." className="pl-10" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Learn the basics of using JobAI</p>
            <Button variant="link" className="mt-4 p-0">
              Read more →
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Profile Setup</h3>
            <p className="text-sm text-muted-foreground">Complete your profile for better matches</p>
            <Button variant="link" className="mt-4 p-0">
              Read more →
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Application Process</h3>
            <p className="text-sm text-muted-foreground">Learn how to apply for jobs efficiently</p>
            <Button variant="link" className="mt-4 p-0">
              Read more →
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">AI Features</h3>
            <p className="text-sm text-muted-foreground">Understand how AI assists your applications</p>
            <Button variant="link" className="mt-4 p-0">
              Read more →
            </Button>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the AI assist with job applications?</AccordionTrigger>
              <AccordionContent>
                Our AI analyzes job descriptions and your profile to automatically fill out applications, generate
                tailored cover letters, and suggest relevant skills and experiences to highlight.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we use industry-standard encryption and security measures to protect your data. Your information is
                never shared without your explicit consent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I edit applications before submission?</AccordionTrigger>
              <AccordionContent>
                Yes, you can review and edit any application before it's submitted. The AI provides suggestions, but you
                have full control over the final content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I track my applications?</AccordionTrigger>
              <AccordionContent>
                The dashboard shows all your applications and their current status. You can also set up notifications
                for updates and follow-ups.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Card className="p-6 text-center">
          <h3 className="font-semibold mb-2">Still need help?</h3>
          <p className="text-sm text-muted-foreground mb-4">Our support team is available 24/7 to assist you</p>
          <Button>Contact Support</Button>
        </Card>
      </div>
    </div>
  )
}

