"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, ArrowRight } from "lucide-react"

const insights = [
  {
    id: "1",
    type: "recommendation",
    priority: "high",
    title: "Traffic Optimization Opportunity",
    description: "AI detected 30% congestion reduction possible with dynamic light timing",
    confidence: 94,
    agent: "Traffic Flow Optimizer",
  },
  {
    id: "2",
    type: "prediction",
    priority: "medium",
    title: "Energy Demand Forecast",
    description: "15% increase in energy consumption expected during evening peak",
    confidence: 88,
    agent: "Energy Grid Manager",
  },
  {
    id: "3",
    type: "alert",
    priority: "high",
    title: "Infrastructure Maintenance",
    description: "Predictive model indicates potential pipe failure in Sector 5 within 48 hours",
    confidence: 92,
    agent: "Infrastructure Monitor",
  },
]

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-accent" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription>Latest recommendations from AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3 rounded-lg bg-muted/50 border-l-4"
              style={{
                borderLeftColor:
                  insight.priority === "high" ? "#ef4444" : insight.priority === "medium" ? "#f59e0b" : "#10b981",
              }}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                      <Badge
                        variant={
                          insight.type === "alert"
                            ? "destructive"
                            : insight.type === "recommendation"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.agent}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}%
                  </Badge>
                </div>

                <p className="text-xs text-foreground">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      insight.priority === "high"
                        ? "border-destructive text-destructive"
                        : insight.priority === "medium"
                          ? "border-yellow-500 text-yellow-600"
                          : "border-accent text-accent"
                    }`}
                  >
                    {insight.priority} priority
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
            <a href="/ai-agents" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>View All AI Insights</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
