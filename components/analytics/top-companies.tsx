import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const companies = [
  {
    name: "Tech Corp",
    applications: 25,
    responses: 18,
    responseRate: 72,
  },
  {
    name: "Innovation Labs",
    applications: 20,
    responses: 12,
    responseRate: 60,
  },
  {
    name: "Design Studio",
    applications: 15,
    responses: 10,
    responseRate: 67,
  },
  {
    name: "Startup Inc",
    applications: 12,
    responses: 8,
    responseRate: 67,
  },
]

export function TopCompanies() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {companies.map((company) => (
            <div key={company.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {company.applications} applications, {company.responses} responses
                  </p>
                </div>
                <span className="text-sm font-medium">{company.responseRate}%</span>
              </div>
              <Progress value={company.responseRate} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

