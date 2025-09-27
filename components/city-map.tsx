"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Car, Zap, Eye } from "lucide-react"

export function CityMap() {
  return (
    <Card className="h-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>City Overview Map</span>
            </CardTitle>
            <CardDescription>Real-time city status and incident locations</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/digital-twin" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>3D View</span>
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden border border-border">
          {/* Grid Background */}
          <div className="absolute inset-0 grid-pattern opacity-20"></div>

          {/* City Layout */}
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Main Roads */}
            <rect x="0" y="140" width="400" height="6" fill="#475569" opacity="0.9" />
            <rect x="180" y="0" width="6" height="300" fill="#475569" opacity="0.9" />
            {/* Secondary Roads */}
            <rect x="0" y="200" width="400" height="4" fill="#64748b" opacity="0.8" />
            <rect x="280" y="0" width="4" height="300" fill="#64748b" opacity="0.8" />

            {/* Buildings with borders for better definition */}
            <rect
              x="120"
              y="100"
              width="40"
              height="30"
              fill="#3b82f6"
              opacity="0.8"
              rx="2"
              stroke="#1e40af"
              strokeWidth="1"
            />
            <rect
              x="220"
              y="160"
              width="35"
              height="25"
              fill="#10b981"
              opacity="0.8"
              rx="2"
              stroke="#047857"
              strokeWidth="1"
            />
            <rect
              x="300"
              y="80"
              width="45"
              height="35"
              fill="#f59e0b"
              opacity="0.8"
              rx="2"
              stroke="#d97706"
              strokeWidth="1"
            />
            <rect
              x="60"
              y="220"
              width="50"
              height="40"
              fill="#8b5cf6"
              opacity="0.8"
              rx="2"
              stroke="#7c3aed"
              strokeWidth="1"
            />

            {/* Additional smaller buildings for more detail */}
            <rect
              x="50"
              y="110"
              width="25"
              height="20"
              fill="#6b7280"
              opacity="0.7"
              rx="1"
              stroke="#4b5563"
              strokeWidth="1"
            />
            <rect
              x="320"
              y="220"
              width="30"
              height="25"
              fill="#ef4444"
              opacity="0.7"
              rx="1"
              stroke="#dc2626"
              strokeWidth="1"
            />
            <rect
              x="250"
              y="90"
              width="20"
              height="15"
              fill="#14b8a6"
              opacity="0.7"
              rx="1"
              stroke="#0f766e"
              strokeWidth="1"
            />

            {/* Incident Markers */}
            <circle cx="140" cy="115" r="8" fill="#ef4444" opacity="0.9" stroke="#fff" strokeWidth="2" />
            <text x="140" y="119" textAnchor="middle" className="text-xs fill-white font-bold">
              🔥
            </text>

            <circle cx="320" cy="180" r="6" fill="#f59e0b" opacity="0.9" stroke="#fff" strokeWidth="2" />
            <text x="320" y="184" textAnchor="middle" className="text-xs fill-white font-bold">
              ⚡
            </text>

            {/* Traffic Flow Indicators */}
            <circle cx="100" cy="142" r="4" fill="#10b981" opacity="0.9" stroke="#fff" strokeWidth="1" />
            <circle cx="200" cy="142" r="4" fill="#f59e0b" opacity="0.9" stroke="#fff" strokeWidth="1" />
            <circle cx="300" cy="142" r="4" fill="#ef4444" opacity="0.9" stroke="#fff" strokeWidth="1" />

            {/* AI Agent Activity */}
            <circle cx="180" cy="50" r="6" fill="#8b5cf6" opacity="0.9" stroke="#fff" strokeWidth="2" />
            <text x="180" y="54" textAnchor="middle" className="text-xs fill-white font-bold">
              🤖
            </text>

            <rect
              x="30"
              y="30"
              width="60"
              height="40"
              fill="#22c55e"
              opacity="0.7"
              rx="4"
              stroke="#16a34a"
              strokeWidth="1"
            />
            <text x="60" y="52" textAnchor="middle" className="text-xs fill-white font-semibold">
              Park
            </text>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-card/95 backdrop-blur-sm rounded-lg p-2 border border-border shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span>Emergency</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Alert</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>Normal</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>AI Active</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="absolute top-2 right-2 space-y-1">
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />3 Alerts
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Car className="w-3 h-3 mr-1" />
              Traffic: Moderate
            </Badge>
            <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
              <Zap className="w-3 h-3 mr-1" />
              AI: Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
