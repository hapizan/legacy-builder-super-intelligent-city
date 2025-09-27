"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp, TrendingDown } from "lucide-react"

const trafficData = [
  { location: "Jalan Teknologi", status: "smooth", flow: 85, change: "+12%" },
  { location: "Persiaran Multimedia", status: "moderate", flow: 65, change: "-5%" },
  { location: "Jalan Impact", status: "congested", flow: 35, change: "-18%" },
  { location: "Persiaran Apec", status: "smooth", flow: 78, change: "+8%" },
]

export function TrafficFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-primary" />
          <span>Traffic Flow Analysis</span>
        </CardTitle>
        <CardDescription>Real-time traffic conditions across major roads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trafficData.map((road, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{road.location}</p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      road.status === "smooth" ? "default" : road.status === "moderate" ? "secondary" : "destructive"
                    }
                    className={
                      road.status === "smooth"
                        ? "bg-accent text-accent-foreground"
                        : road.status === "moderate"
                          ? ""
                          : ""
                    }
                  >
                    {road.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Flow: {road.flow}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {road.change.startsWith("+") ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        road.change.startsWith("+") ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {road.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">vs last hour</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
