import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface ReviewProps {
  data: any
  job: any
}

export function Review({ data, job }: ReviewProps) {
  const sections = [
    {
      title: "Personal Information",
      items: [
        { label: "Name", value: `${data.firstName} ${data.lastName}` },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
      ],
    },
    {
      title: "Professional Summary",
      content: data.summary,
    },
    {
      title: "Work Experience",
      items: data.experiences?.map((exp: any) => ({
        title: exp.position,
        subtitle: exp.company,
        date: `${exp.startDate} - ${exp.endDate || "Present"}`,
        content: exp.description,
      })),
    },
    {
      title: "Cover Letter",
      content: data.coverLetter,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Application Summary</h3>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Company: {job?.company}</p>
            <p>Position: {job?.title}</p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium">{section.title}</h4>

              {"items" in section ? (
                <div className="space-y-4">
                  {section.items?.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="space-y-2">
                      {item.title ? (
                        <>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                          <div className="text-sm">{item.date}</div>
                          <p className="text-sm">{item.content}</p>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm">{item.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{section.content}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Ready to submit</span>
          </div>
          <Button>Submit Application</Button>
        </div>
      </Card>
    </div>
  )
}

