import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { SystemStatus } from "@/components/system-status"
import { CityMap } from "@/components/city-map"
import { AIInsights } from "@/components/ai-insights"
import { EmergencyAlerts } from "@/components/emergency-alerts-widget"
import { TrafficFlow } from "@/components/traffic-flow"
import { EnergyConsumption } from "@/components/energy-consumption"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Emergency Alerts Banner - Moved to Top */}
      <EmergencyAlerts />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Buildings" value="2,847" change="+12" changeType="positive" icon="🏢" />
        <MetricCard title="Population" value="65,000" change="+2.3%" changeType="positive" icon="👥" />
        <MetricCard title="Active Alerts" value="3" change="-2" changeType="positive" icon="⚠️" />
        <MetricCard title="Energy Usage" value="847 MW" change="-5.2%" changeType="positive" icon="⚡" />
      </div>

      {/* Navigation Cards - Moved Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors group glow-blue">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span className="text-2xl">🏢</span>
              <span>3D Digital Twin</span>
            </CardTitle>
            <CardDescription>Explore the interactive 3D model of Cyberjaya</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Buildings:</span>
                <span className="font-medium text-primary">2,847</span>
              </div>
              <div className="flex justify-between">
                <span>Zones:</span>
                <span className="font-medium text-primary">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors group glow-orange">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span className="text-2xl">🚨</span>
              <span>Emergency Response</span>
            </CardTitle>
            <CardDescription>Monitor and manage emergency situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 bg-gradient-to-br from-destructive/20 to-warning/20 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🚨</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Active Incidents:</span>
                <span className="font-medium text-destructive">3</span>
              </div>
              <div className="flex justify-between">
                <span>Response Units:</span>
                <span className="font-medium text-warning">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors group glow-teal">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <span>AI Agents</span>
            </CardTitle>
            <CardDescription>View AI-powered insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Active Agents:</span>
                <span className="font-medium text-accent">7</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Confidence:</span>
                <span className="font-medium text-success">91%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors group glow-green">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span className="text-2xl">📍</span>
              <span>Town Planning</span>
            </CardTitle>
            <CardDescription>Manage city development and zoning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 bg-gradient-to-br from-success/20 to-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-4xl">📍</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Pending Permits:</span>
                <span className="font-medium text-warning">8</span>
              </div>
              <div className="flex justify-between">
                <span>Active Projects:</span>
                <span className="font-medium text-success">15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI Insights - Full Left Side */}
        <div className="lg:col-span-1">
          <AIInsights />
        </div>

        {/* City Map Overview */}
        <div className="lg:col-span-2">
          <CityMap />
        </div>

        {/* System Status */}
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficFlow />
        <EnergyConsumption />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <span>Recent System Activities</span>
          </CardTitle>
          <CardDescription>Latest updates from all city systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "2 minutes ago",
                system: "AI Traffic Optimizer",
                event: "Optimized traffic lights on Jalan Teknologi - reduced congestion by 23%",
                type: "success",
                icon: "🤖",
              },
              {
                time: "5 minutes ago",
                system: "Emergency Response",
                event: "Fire incident at City Centre Block A - 45 people safely evacuated",
                type: "warning",
                icon: "🚨",
              },
              {
                time: "15 minutes ago",
                system: "Town Planning",
                event: "New building permit approved for residential complex in Sector 7",
                type: "info",
                icon: "📍",
              },
              {
                time: "30 minutes ago",
                system: "Energy Grid AI",
                event: "Balanced power distribution across sectors - 12% energy savings achieved",
                type: "success",
                icon: "⚡",
              },
              {
                time: "1 hour ago",
                system: "Infrastructure Monitor",
                event: "Potential pipe leak detected in Sector 5 - maintenance team dispatched",
                type: "warning",
                icon: "📊",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === "success"
                      ? "bg-success/20 text-success"
                      : activity.type === "warning"
                        ? "bg-warning/20 text-warning"
                        : "bg-info/20 text-info"
                  }`}
                >
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground">{activity.system}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.event}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
