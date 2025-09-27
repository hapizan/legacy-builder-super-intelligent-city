"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  AlertTriangle,
  Building2,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Brain,
  Target,
  BarChart3,
} from "lucide-react"

const aiAgents = [
  {
    id: "traffic-ai",
    name: "Traffic Flow Optimizer",
    type: "Traffic Management",
    status: "active",
    confidence: 96,
    lastAction: "Optimized traffic lights on Jalan Teknologi",
    impact: "Reduced congestion by 23%",
    icon: Car,
    color: "#3b82f6",
  },
  {
    id: "emergency-ai",
    name: "Emergency Response Coordinator",
    type: "Emergency Management",
    status: "active",
    confidence: 89,
    lastAction: "Calculated optimal evacuation routes",
    impact: "Improved response time by 15%",
    icon: AlertTriangle,
    color: "#ef4444",
  },
  {
    id: "planning-ai",
    name: "Urban Planning Assistant",
    type: "City Planning",
    status: "active",
    confidence: 92,
    lastAction: "Analyzed zoning efficiency",
    impact: "Identified 3 optimization opportunities",
    icon: Building2,
    color: "#10b981",
  },
  {
    id: "energy-ai",
    name: "Energy Grid Manager",
    type: "Utilities",
    status: "active",
    confidence: 94,
    lastAction: "Balanced power distribution",
    impact: "Reduced energy waste by 12%",
    icon: Zap,
    color: "#f59e0b",
  },
  {
    id: "predictive-ai",
    name: "Predictive Analytics Engine",
    type: "Analytics",
    status: "learning",
    confidence: 87,
    lastAction: "Processing historical data patterns",
    impact: "Forecasting accuracy: 91%",
    icon: TrendingUp,
    color: "#8b5cf6",
  },
  {
    id: "maintenance-ai",
    name: "Infrastructure Monitor",
    type: "Maintenance",
    status: "active",
    confidence: 91,
    lastAction: "Detected potential pipe leak in Sector 5",
    impact: "Prevented 2 infrastructure failures",
    icon: Activity,
    color: "#06b6d4",
  },
]

const aiInsights = [
  {
    id: "insight-1",
    agent: "Traffic Flow Optimizer",
    type: "recommendation",
    priority: "high",
    title: "Peak Hour Traffic Optimization",
    description: "Implementing dynamic traffic light timing could reduce peak hour congestion by 30%",
    confidence: 94,
    timeframe: "Immediate",
  },
  {
    id: "insight-2",
    agent: "Urban Planning Assistant",
    type: "prediction",
    priority: "medium",
    title: "Residential Demand Forecast",
    description: "Population growth will require 15% more residential zones by 2026",
    confidence: 88,
    timeframe: "2-3 years",
  },
  {
    id: "insight-3",
    agent: "Energy Grid Manager",
    type: "alert",
    priority: "high",
    title: "Energy Consumption Spike",
    description: "Unusual energy pattern detected in commercial district - investigate potential issues",
    confidence: 96,
    timeframe: "Within 24 hours",
  },
]

export function AIAgentsDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent) => (
              <Card
                key={agent.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedAgent === agent.id ? "ring-2 ring-ring" : ""
                }`}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${agent.color}20` }}
                      >
                        <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">{agent.type}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={agent.status === "active" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {agent.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {agent.status === "learning" && <Clock className="w-3 h-3 mr-1" />}
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{agent.confidence}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${agent.confidence}%`,
                          backgroundColor: agent.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Last Action:</p>
                    <p className="text-xs text-foreground">{agent.lastAction}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Impact:</p>
                    <p className="text-xs font-medium text-accent">{agent.impact}</p>
                  </div>

                  {selectedAgent === agent.id && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Brain className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">AI-Generated Insights</h3>

            {aiInsights.map((insight) => (
              <Card
                key={insight.id}
                className="border-l-4"
                style={{
                  borderLeftColor:
                    insight.priority === "high" ? "#ef4444" : insight.priority === "medium" ? "#f59e0b" : "#10b981",
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <Badge
                          variant={
                            insight.type === "alert"
                              ? "destructive"
                              : insight.type === "recommendation"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {insight.type}
                        </Badge>
                      </div>
                      <CardDescription>Generated by {insight.agent}</CardDescription>
                    </div>
                    <Badge variant="outline">{insight.priority} priority</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground">{insight.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>Confidence: {insight.confidence}%</span>
                      <span>Timeframe: {insight.timeframe}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Target className="w-3 h-3 mr-1" />
                      Implement
                    </Button>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">7</div>
                <p className="text-xs text-muted-foreground">6 active, 1 learning</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">91%</div>
                <p className="text-xs text-accent">+3% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">1,247</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">94.2%</div>
                <p className="text-xs text-accent">+1.2% improvement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
              <CardDescription>Real-time performance data for all AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{agent.confidence}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${agent.confidence}%`,
                          backgroundColor: agent.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
