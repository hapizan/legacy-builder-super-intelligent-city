"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Zap, Droplets, Users, Route, Target, Navigation } from "lucide-react"

interface EmergencyIncident {
  id: string
  type: "fire" | "power" | "flood" | "medical" | "security"
  x: number
  y: number
  severity: "low" | "medium" | "high"
  title: string
  status: "active" | "responding" | "contained" | "resolved"
}

interface EmergencyUnit {
  id: string
  type: "fire" | "police" | "medical" | "utility"
  x: number
  y: number
  status: "available" | "dispatched" | "on-scene"
  callSign: string
}

const incidents: EmergencyIncident[] = [
  { id: "I001", type: "fire", x: 200, y: 150, severity: "high", title: "Building Fire", status: "active" },
  { id: "I002", type: "power", x: 400, y: 250, severity: "medium", title: "Power Outage", status: "responding" },
  { id: "I003", type: "flood", x: 300, y: 350, severity: "low", title: "Minor Flooding", status: "contained" },
]

const emergencyUnits: EmergencyUnit[] = [
  { id: "U001", type: "fire", x: 150, y: 100, status: "dispatched", callSign: "Fire-1" },
  { id: "U002", type: "fire", x: 180, y: 120, status: "on-scene", callSign: "Fire-2" },
  { id: "U003", type: "police", x: 350, y: 200, status: "available", callSign: "Police-1" },
  { id: "U004", type: "medical", x: 250, y: 300, status: "dispatched", callSign: "Ambulance-1" },
  { id: "U005", type: "utility", x: 420, y: 280, status: "on-scene", callSign: "Utility-1" },
]

const evacuationRoutes = [
  { from: { x: 200, y: 150 }, to: { x: 100, y: 50 }, color: "#ef4444" },
  { from: { x: 200, y: 150 }, to: { x: 300, y: 50 }, color: "#ef4444" },
  { from: { x: 200, y: 150 }, to: { x: 150, y: 250 }, color: "#ef4444" },
]

const incidentIcons = {
  fire: Flame,
  power: Zap,
  flood: Droplets,
  medical: Users,
  security: Target,
}

const unitIcons = {
  fire: Flame,
  police: Target,
  medical: Users,
  utility: Zap,
}

export function EmergencyMap() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  return (
    <div className="w-full h-full bg-muted/20 relative overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Card>
          <CardContent className="p-2">
            <div className="flex space-x-1">
              <Button variant={showRoutes ? "default" : "ghost"} size="sm" onClick={() => setShowRoutes(!showRoutes)}>
                <Route className="w-4 h-4 mr-2" />
                Routes
              </Button>
              <Button variant="ghost" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Map */}
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 600 500">
        {/* Grid Background */}
        <defs>
          <pattern id="emergency-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#emergency-grid)" />

        {/* City Layout */}
        <g opacity="0.6">
          {/* Buildings */}
          <rect x="180" y="130" width="40" height="40" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
          <rect x="380" y="230" width="40" height="40" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
          <rect x="280" y="330" width="40" height="40" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />

          {/* Roads */}
          <rect x="0" y="200" width="600" height="6" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <rect x="250" y="0" width="6" height="500" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        </g>

        {/* Evacuation Routes */}
        {showRoutes &&
          evacuationRoutes.map((route, index) => (
            <g key={index}>
              <line
                x1={route.from.x}
                y1={route.from.y}
                x2={route.to.x}
                y2={route.to.y}
                stroke={route.color}
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.7"
              />
              <circle cx={route.to.x} cy={route.to.y} r="8" fill={route.color} opacity="0.8" />
              <text
                x={route.to.x}
                y={route.to.y + 20}
                textAnchor="middle"
                className="text-xs fill-foreground font-medium"
              >
                EXIT
              </text>
            </g>
          ))}

        {/* Emergency Incidents */}
        {incidents.map((incident) => (
          <g key={incident.id}>
            <circle
              cx={incident.x}
              cy={incident.y}
              r="20"
              fill={incident.severity === "high" ? "#ef4444" : incident.severity === "medium" ? "#f59e0b" : "#3b82f6"}
              opacity={selectedIncident === incident.id ? 0.9 : 0.7}
              stroke={selectedIncident === incident.id ? "hsl(var(--ring))" : "white"}
              strokeWidth={selectedIncident === incident.id ? 3 : 2}
              className="cursor-pointer hover:opacity-90 transition-all"
              onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
            />
            <text
              x={incident.x}
              y={incident.y + 4}
              textAnchor="middle"
              className="text-xs fill-white font-bold pointer-events-none"
            >
              {incident.type.toUpperCase()}
            </text>
            {selectedIncident === incident.id && (
              <text
                x={incident.x}
                y={incident.y - 30}
                textAnchor="middle"
                className="text-sm fill-foreground font-medium"
              >
                {incident.title}
              </text>
            )}
          </g>
        ))}

        {/* Emergency Units */}
        {emergencyUnits.map((unit) => (
          <g key={unit.id}>
            <rect
              x={unit.x - 12}
              y={unit.y - 12}
              width="24"
              height="24"
              rx="4"
              fill={unit.status === "available" ? "#10b981" : unit.status === "dispatched" ? "#f59e0b" : "#ef4444"}
              opacity={selectedUnit === unit.id ? 0.9 : 0.8}
              stroke={selectedUnit === unit.id ? "hsl(var(--ring))" : "white"}
              strokeWidth={selectedUnit === unit.id ? 2 : 1}
              className="cursor-pointer hover:opacity-90 transition-all"
              onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
            />
            <text
              x={unit.x}
              y={unit.y + 3}
              textAnchor="middle"
              className="text-xs fill-white font-bold pointer-events-none"
            >
              {unit.type === "fire" ? "🚒" : unit.type === "police" ? "🚔" : unit.type === "medical" ? "🚑" : "🚛"}
            </text>
            {selectedUnit === unit.id && (
              <text x={unit.x} y={unit.y - 20} textAnchor="middle" className="text-sm fill-foreground font-medium">
                {unit.callSign}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 p-4">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm">Emergency Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Incidents</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>High Severity</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Medium Severity</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Low Severity</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Units</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded bg-accent" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span>Dispatched</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded bg-destructive" />
                <span>On Scene</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
