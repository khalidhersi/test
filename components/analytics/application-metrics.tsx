import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12,
    completed: 8,
  },
  {
    name: "Feb",
    total: 15,
    completed: 10,
  },
  {
    name: "Mar",
    total: 18,
    completed: 12,
  },
  {
    name: "Apr",
    total: 14,
    completed: 9,
  },
  {
    name: "May",
    total: 20,
    completed: 14,
  },
  {
    name: "Jun",
    total: 25,
    completed: 18,
  },
]

export function ApplicationMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            <Bar dataKey="completed" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary/50" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

