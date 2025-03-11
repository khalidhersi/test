import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Mon",
    applications: 4,
  },
  {
    date: "Tue",
    applications: 6,
  },
  {
    date: "Wed",
    applications: 8,
  },
  {
    date: "Thu",
    applications: 5,
  },
  {
    date: "Fri",
    applications: 7,
  },
  {
    date: "Sat",
    applications: 3,
  },
  {
    date: "Sun",
    applications: 2,
  },
]

export function TimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="currentColor"
              strokeWidth={2}
              dot={{ fill: "currentColor" }}
              className="stroke-primary"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

