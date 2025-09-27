"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ZoomIn, ZoomOut, RotateCcw, Layers, Settings, ArrowLeft } from "lucide-react"

export function DigitalTwinControls() {
  const [showLayers, setShowLayers] = useState(true)
  const [viewMode, setViewMode] = useState("3d")

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </Button>
          <h1 className="text-xl font-semibold text-foreground">3D Digital Twin</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Controls */}
          <Card>
            <CardContent className="p-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Reset View">
                  <Home className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Reset Rotation">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardContent className="p-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant={showLayers ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowLayers(!showLayers)}
                  title="Toggle Layers"
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="View Settings">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
