"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MousePointer,
  Square,
  Circle,
  Move,
  RotateCw,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Home,
  Layers,
  Ruler,
  MapPin,
} from "lucide-react"

const tools = [
  { id: "select", name: "Select", icon: MousePointer },
  { id: "zone", name: "Zone", icon: Square },
  { id: "building", name: "Building", icon: Circle },
  { id: "road", name: "Road", icon: Ruler },
  { id: "landmark", name: "Landmark", icon: MapPin },
]

const actions = [
  { id: "move", name: "Move", icon: Move },
  { id: "rotate", name: "Rotate", icon: RotateCw },
  { id: "copy", name: "Copy", icon: Copy },
  { id: "delete", name: "Delete", icon: Trash2 },
]

export function PlanningToolbar() {
  const [activeTool, setActiveTool] = useState("select")

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card>
        <CardContent className="p-2">
          <div className="flex flex-col space-y-2">
            {/* Drawing Tools */}
            <div className="flex space-x-1">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTool(tool.id)}
                  title={tool.name}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator />

            {/* Action Tools */}
            <div className="flex space-x-1">
              {actions.map((action) => (
                <Button key={action.id} variant="ghost" size="sm" title={action.name}>
                  <action.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator />

            {/* View Controls */}
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Fit to View">
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Toggle Layers">
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
