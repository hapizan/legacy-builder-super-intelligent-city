"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Flame, Zap, Droplets, Clock } from "lucide-react"

const alerts = [
  {
    id: "E001",
    type: "fire",
    severity: "high",
    title: "Building Fire - Cyberjaya City Centre",
    location: "Block A, Level 15",
    time: "2 minutes ago",
    status: "active",
    icon: Flame,
  },
  {
    id: "E002",
    type: "power",
    severity: "medium",
    title: "Power Outage - Residential Area",
    location: "Sector 7, Buildings 12-18",
    time: "8 minutes ago",
    status: "responding",
    icon: Zap,
  },
  {
    id: "E003",
    type: "flood",
    severity: "low",
    title: "Minor Flooding - Underground Parking",
    location: "Tamarind Square Basement",
    time: "15 minutes ago",
    status: "contained",
    icon: Droplets,
  },
]

export function EmergencyAlerts() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId])
  }

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 p-4">
      <div className="space-y-2">
        {visibleAlerts.map((alert) => (
          <Card key={alert.id} className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alert.severity === "high"
                        ? "bg-destructive text-destructive-foreground"
                        : alert.severity === "medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-500 text-white"
                    }`}
                  >
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-foreground">{alert.title}</h3>
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">{alert.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>{alert.location}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
