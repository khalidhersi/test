import { ProgressClient } from "@/components/progress-client"

export default function DashboardClientPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard (Client)</h1>
      <ProgressClient />
    </div>
  )
}

