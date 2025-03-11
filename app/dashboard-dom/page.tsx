import { ProgressDOMManipulator } from "@/components/progress-dom-manipulator"

export default function DashboardDOMPage() {
  return (
    <div className="dashboard-container p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard (DOM Manipulation)</h1>
      <ProgressDOMManipulator />
      <div className="text-center py-12 text-muted-foreground">
        If you can see this text, the Progress section should appear below.
      </div>
    </div>
  )
}

