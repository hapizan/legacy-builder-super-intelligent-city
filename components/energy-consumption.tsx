"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, TrendingDown } from "lucide-react"

const energyData = [
  { sector: "Commercial District", consumption: 245, capacity: 300, efficiency: 92, change: "-5%" },
  { sector: "Residential Areas", consumption: 180, capacity: 220, efficiency: 88, change: "+2%" },
  { sector: "Industrial Zone", consumption: 320, capacity: 400, efficiency: 85, change: "-8%" },
  { sector: "Public Facilities", consumption: 102, capacity: 150, efficiency: 95, change: "-12%" },
]

export function EnergyConsumption() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Energy Consumption</span>
        </CardTitle>
        <CardDescription>Real-time energy usage across city sectors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {energyData.map((sector, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{sector.sector}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {sector.consumption}MW / {sector.capacity}MW
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {sector.efficiency}% efficient
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {sector.change.startsWith("+") ? (
                    <TrendingUp className="w-4 h-4 text-destructive" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-accent" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      sector.change.startsWith("+") ? "text-destructive" : "text-accent"
                    }`}
                  >
                    {sector.change}
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-yellow-500 transition-all"
                  style={{ width: `${(sector.consumption / sector.capacity) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
