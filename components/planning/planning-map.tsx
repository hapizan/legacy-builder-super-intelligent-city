"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Zone {
  id: string
  type: "residential" | "commercial" | "industrial" | "green" | "mixed"
  x: number
  y: number
  width: number
  height: number
  name: string
}

const initialZones: Zone[] = [
  { id: "1", type: "commercial", x: 100, y: 100, width: 120, height: 80, name: "City Centre" },
  { id: "2", type: "residential", x: 250, y: 150, width: 100, height: 100, name: "Residential Area A" },
  { id: "3", type: "industrial", x: 400, y: 200, width: 150, height: 60, name: "Tech Park" },
  { id: "4", type: "green", x: 150, y: 300, width: 200, height: 80, name: "Central Park" },
  { id: "5", type: "mixed", x: 350, y: 350, width: 120, height: 90, name: "Mixed Development" },
]

const zoneColors = {
  residential: "#8b5cf6",
  commercial: "#3b82f6",
  industrial: "#10b981",
  green: "#84cc16",
  mixed: "#f59e0b",
}

export function PlanningMap() {
  const [zones, setZones] = useState<Zone[]>(initialZones)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAddingZone, setIsAddingZone] = useState(false)
  const [newZoneType, setNewZoneType] = useState<Zone["type"]>("residential")
  const svgRef = useRef<SVGSVGElement>(null)

  const handleZoneMouseDown = (e: React.MouseEvent, zoneId: string) => {
    e.preventDefault()
    setSelectedZone(zoneId)
    setIsDragging(true)

    const zone = zones.find((z) => z.id === zoneId)
    if (zone && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setDragOffset({
        x: mouseX - zone.x,
        y: mouseY - zone.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedZone && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setZones(
        zones.map((zone) =>
          zone.id === selectedZone ? { ...zone, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y } : zone,
        ),
      )
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isAddingZone && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const newZone: Zone = {
        id: Date.now().toString(),
        type: newZoneType,
        x: mouseX - 50,
        y: mouseY - 40,
        width: 100,
        height: 80,
        name: `New ${newZoneType.charAt(0).toUpperCase() + newZoneType.slice(1)}`,
      }

      setZones([...zones, newZone])
      setIsAddingZone(false)
    }
  }

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-900/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Card className="p-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Add Zone</h3>
            <select
              value={newZoneType}
              onChange={(e) => setNewZoneType(e.target.value as Zone["type"])}
              className="w-full text-xs p-1 rounded border bg-background"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="green">Green Space</option>
              <option value="mixed">Mixed Use</option>
            </select>
            <Button
              size="sm"
              onClick={() => setIsAddingZone(!isAddingZone)}
              variant={isAddingZone ? "destructive" : "default"}
              className="w-full"
            >
              <Plus className="w-3 h-3 mr-1" />
              {isAddingZone ? "Cancel" : "Add Zone"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Planning Canvas */}
      <svg
        ref={svgRef}
        className={`w-full h-full ${isAddingZone ? "cursor-crosshair" : "cursor-default"}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g>
          <rect x="0" y="250" width="800" height="8" fill="#475569" opacity="0.8" />
          <rect x="300" y="0" width="8" height="600" fill="#475569" opacity="0.8" />
          <rect x="0" y="400" width="800" height="6" fill="#64748b" opacity="0.7" />
          <rect x="500" y="0" width="6" height="600" fill="#64748b" opacity="0.7" />
        </g>

        {/* Zones */}
        {zones.map((zone) => (
          <g key={zone.id}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              fill={zoneColors[zone.type]}
              fillOpacity={selectedZone === zone.id ? 0.8 : 0.6}
              stroke={selectedZone === zone.id ? "hsl(var(--ring))" : zoneColors[zone.type]}
              strokeWidth={selectedZone === zone.id ? 3 : 1}
              className="cursor-move hover:fill-opacity-80 transition-all"
              onMouseDown={(e) => handleZoneMouseDown(e, zone.id)}
            />
            <text
              x={zone.x + zone.width / 2}
              y={zone.y + zone.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-white pointer-events-none"
            >
              {zone.name}
            </text>
            <text
              x={zone.x + zone.width / 2}
              y={zone.y + zone.height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-white/80 pointer-events-none capitalize"
            >
              {zone.type}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Zone Types</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(zoneColors).map(([type, color]) => (
              <div key={type} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
          {isAddingZone && (
            <div className="mt-2 p-2 bg-primary/10 rounded text-xs text-primary">
              Click anywhere to add a {newZoneType} zone
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
