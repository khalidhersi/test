import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted" />
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background text-sm font-medium",
                index <= currentStep ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground",
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                index <= currentStep ? "text-primary" : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

