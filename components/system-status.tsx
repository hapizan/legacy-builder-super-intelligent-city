import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

const systems = [
  { name: "Digital Twin Engine", status: "operational", uptime: "99.9%" },
  { name: "Traffic Control", status: "operational", uptime: "99.7%" },
  { name: "Emergency Systems", status: "operational", uptime: "100%" },
  { name: "AI Agents", status: "warning", uptime: "98.2%" },
  { name: "Data Collection", status: "operational", uptime: "99.5%" },
  { name: "Communication Network", status: "maintenance", uptime: "95.1%" },
]

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span>System Status</span>
        </CardTitle>
        <CardDescription>Real-time status of all city systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                {system.status === "operational" && <CheckCircle className="w-4 h-4 text-accent" />}
                {system.status === "warning" && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                {system.status === "maintenance" && <Clock className="w-4 h-4 text-primary" />}
                {system.status === "error" && <XCircle className="w-4 h-4 text-destructive" />}
                <span className="text-sm font-medium text-foreground">{system.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{system.uptime}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
