import { ApplicationMetrics } from "@/components/analytics/application-metrics"
import { SuccessRate } from "@/components/analytics/success-rate"
import { TimelineChart } from "@/components/analytics/timeline-chart"
import { TopCompanies } from "@/components/analytics/top-companies"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Analytics</h1>

      <ApplicationMetrics />

      <div className="grid gap-6 md:grid-cols-2">
        <SuccessRate />
        <TimelineChart />
      </div>

      <TopCompanies />
    </div>
  )
}

