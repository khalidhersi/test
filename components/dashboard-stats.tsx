import { Card3D } from "@/components/ui/card-3d"
import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle, Clock, XCircle } from "lucide-react"

const stats = [
  {
    icon: Send,
    title: "Total Applications",
    value: "127",
    change: "+10",
    iconClass: "text-primary",
    bgClass: "bg-primary/10 dark:bg-primary/20",
    changeClass: "text-primary",
  },
  {
    icon: CheckCircle,
    title: "Successful",
    value: "89",
    change: "70%",
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    changeClass: "text-emerald-500",
  },
  {
    icon: Clock,
    title: "Pending",
    value: "24",
    change: "Active",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    changeClass: "text-amber-500",
  },
  {
    icon: XCircle,
    title: "Failed",
    value: "14",
    change: "11%",
    iconClass: "text-rose-500",
    bgClass: "bg-rose-500/10 dark:bg-rose-500/20",
    changeClass: "text-rose-500",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card3D key={index}>
          <Card className="w-full h-full bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgClass}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">{stat.value}</h2>
                    <span className={stat.changeClass}>{stat.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Card3D>
      ))}
    </div>
  )
}

