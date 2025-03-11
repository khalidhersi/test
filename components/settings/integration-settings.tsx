"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { LinkedinIcon as LinkedIn, Github, ChromeIcon as Google } from "lucide-react"

const integrations = [
  {
    name: "LinkedIn",
    icon: LinkedIn,
    description: "Import your professional experience and network",
    connected: true,
    lastSync: "2024-02-25",
  },
  {
    name: "GitHub",
    icon: Github,
    description: "Showcase your repositories and contributions",
    connected: false,
  },
  {
    name: "Google",
    icon: Google,
    description: "Sync your calendar for interview scheduling",
    connected: true,
    lastSync: "2024-02-24",
  },
]

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      {integrations.map((integration) => (
        <Card key={integration.name} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-secondary rounded-lg">
                <integration.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{integration.name}</h3>
                  {integration.connected && <Badge variant="secondary">Connected</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                {integration.lastSync && (
                  <p className="text-xs text-muted-foreground">Last synced: {integration.lastSync}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {integration.connected ? (
                <>
                  <Switch defaultChecked />
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </>
              ) : (
                <Button>Connect</Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

