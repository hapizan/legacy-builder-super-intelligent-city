"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Car,
  Zap,
  Droplets,
  Thermometer,
  Wind,
  Users,
  Building2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  WifiOff,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react"

interface DataStream {
  id: string
  name: string
  category: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  lastUpdate: string
  icon: any
  color: string
  history: number[]
}

const initialDataStreams: DataStream[] = [
  {
    id: "traffic-flow",
    name: "Traffic Flow Rate",
    category: "Transportation",
    value: 1247,
    unit: "vehicles/hour",
    status: "normal",
    trend: "up",
    lastUpdate: "2s ago",
    icon: Car,
    color: "#3b82f6",
    history: [1200, 1220, 1240, 1247],
  },
  {
    id: "energy-consumption",
    name: "City Energy Usage",
    category: "Utilities",
    value: 847,
    unit: "MW",
    status: "normal",
    trend: "down",
    lastUpdate: "1s ago",
    icon: Zap,
    color: "#f59e0b",
    history: [860, 855, 850, 847],
  },
  {
    id: "water-pressure",
    name: "Water System Pressure",
    category: "Utilities",
    value: 4.2,
    unit: "bar",
    status: "warning",
    trend: "down",
    lastUpdate: "3s ago",
    icon: Droplets,
    color: "#06b6d4",
    history: [4.5, 4.4, 4.3, 4.2],
  },
  {
    id: "air-quality",
    name: "Air Quality Index",
    category: "Environment",
    value: 42,
    unit: "AQI",
    status: "normal",
    trend: "stable",
    lastUpdate: "5s ago",
    icon: Wind,
    color: "#10b981",
    history: [41, 42, 42, 42],
  },
  {
    id: "temperature",
    name: "Average Temperature",
    category: "Environment",
    value: 28.5,
    unit: "°C",
    status: "normal",
    trend: "up",
    lastUpdate: "2s ago",
    icon: Thermometer,
    color: "#ef4444",
    history: [28.1, 28.2, 28.4, 28.5],
  },
  {
    id: "population-density",
    name: "Population Density",
    category: "Demographics",
    value: 2847,
    unit: "people/km²",
    status: "normal",
    trend: "up",
    lastUpdate: "10s ago",
    icon: Users,
    color: "#8b5cf6",
    history: [2820, 2830, 2840, 2847],
  },
  {
    id: "building-occupancy",
    name: "Building Occupancy",
    category: "Infrastructure",
    value: 78,
    unit: "%",
    status: "normal",
    trend: "stable",
    lastUpdate: "4s ago",
    icon: Building2,
    color: "#84cc16",
    history: [77, 78, 78, 78],
  },
  {
    id: "emergency-calls",
    name: "Emergency Call Volume",
    category: "Safety",
    value: 12,
    unit: "calls/hour",
    status: "critical",
    trend: "up",
    lastUpdate: "1s ago",
    icon: AlertTriangle,
    color: "#ef4444",
    history: [8, 10, 11, 12],
  },
]

export function RealtimeDataGrid() {
  const [dataStreams, setDataStreams] = useState<DataStream[]>(initialDataStreams)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!autoRefresh || isPaused) return

    const connectToStream = () => {
      setConnectionStatus("connecting")

      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      // Create new EventSource connection
      eventSourceRef.current = new EventSource("/api/realtime/websocket?stream=all")

      eventSourceRef.current.onopen = () => {
        setConnectionStatus("connected")
        setIsConnected(true)
        console.log("[v0] Real-time data stream connected")
      }

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("[v0] Received real-time data:", data)

          // Update data streams with live data
          setDataStreams((prev) =>
            prev.map((stream) => {
              const newValue =
                data.data.traffic?.flow ||
                data.data.energy?.consumption ||
                data.data.environment?.temperature ||
                stream.value + (Math.random() - 0.5) * (stream.value * 0.05)

              const updatedHistory = [...stream.history.slice(-19), newValue]
              const trend =
                newValue > stream.history[stream.history.length - 1]
                  ? "up"
                  : newValue < stream.history[stream.history.length - 1]
                    ? "down"
                    : "stable"

              return {
                ...stream,
                value: newValue,
                lastUpdate: "now",
                trend,
                status: Math.random() > 0.95 ? "critical" : Math.random() > 0.85 ? "warning" : "normal",
                history: updatedHistory,
              }
            }),
          )
        } catch (error) {
          console.error("[v0] Error parsing real-time data:", error)
        }
      }

      eventSourceRef.current.onerror = () => {
        setConnectionStatus("disconnected")
        setIsConnected(false)
        console.log("[v0] Real-time data stream disconnected")

        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (autoRefresh && !isPaused) {
            connectToStream()
          }
        }, 3000)
      }
    }

    connectToStream()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [autoRefresh, isPaused])

  const handleTogglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReconnect = () => {
    setIsPaused(false)
    setAutoRefresh(true)
  }

  const categories = ["all", ...Array.from(new Set(dataStreams.map((stream) => stream.category)))]
  const filteredStreams =
    selectedCategory === "all" ? dataStreams : dataStreams.filter((stream) => stream.category === selectedCategory)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {connectionStatus === "connected" ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : connectionStatus === "connecting" ? (
              <Wifi className="w-5 h-5 text-yellow-500 animate-pulse" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {connectionStatus === "connected"
                ? "Live Data Stream"
                : connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label htmlFor="auto-refresh" className="text-sm">
              Auto Refresh
            </Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePause}
            className="flex items-center space-x-2 bg-transparent"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReconnect}
            disabled={connectionStatus === "connected"}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reconnect</span>
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-foreground">Filter by category:</span>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-accent text-accent-foreground" : "bg-transparent"}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Data Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStreams.map((stream) => (
          <Card
            key={stream.id}
            className={`transition-all hover:shadow-lg ${
              stream.status === "critical"
                ? "border-destructive/50 bg-destructive/5"
                : stream.status === "warning"
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stream.color}20` }}
                  >
                    <stream.icon className="w-5 h-5" style={{ color: stream.color }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{stream.name}</CardTitle>
                    <CardDescription className="text-xs">{stream.category}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    stream.status === "critical" ? "destructive" : stream.status === "warning" ? "secondary" : "default"
                  }
                  className={
                    stream.status === "normal"
                      ? "bg-accent text-accent-foreground"
                      : stream.status === "warning"
                        ? "bg-yellow-500 text-white"
                        : ""
                  }
                >
                  {stream.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {typeof stream.value === "number" ? stream.value.toFixed(1) : stream.value}
                  </span>
                  <div className="flex items-center space-x-1">
                    {stream.trend === "up" && <TrendingUp className="w-4 h-4 text-accent" />}
                    {stream.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                    {stream.trend === "stable" && <Activity className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{stream.unit}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last update: {stream.lastUpdate}</span>
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: isConnected ? stream.color : "#6b7280" }}
                />
              </div>

              <div className="w-full h-8 bg-muted/30 rounded flex items-end justify-center space-x-1 p-1">
                {stream.history.slice(-12).map((value, i) => {
                  const maxValue = Math.max(...stream.history)
                  const minValue = Math.min(...stream.history)
                  const normalizedHeight = ((value - minValue) / (maxValue - minValue)) * 100 || 50

                  return (
                    <div
                      key={i}
                      className="w-1 rounded-sm transition-all duration-300"
                      style={{
                        height: `${Math.max(normalizedHeight, 10)}%`,
                        backgroundColor: stream.color,
                        opacity: 0.6 + (i / 12) * 0.4, // Fade effect for older data
                      }}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Stream Summary</CardTitle>
          <CardDescription>Overview of all real-time data streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{dataStreams.length}</div>
              <p className="text-sm text-muted-foreground">Total Streams</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {dataStreams.filter((s) => s.status === "normal").length}
              </div>
              <p className="text-sm text-muted-foreground">Normal Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {dataStreams.filter((s) => s.status === "warning").length}
              </div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {dataStreams.filter((s) => s.status === "critical").length}
              </div>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
