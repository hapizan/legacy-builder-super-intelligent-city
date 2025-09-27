"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Activity, Wifi, Pause, Play, Download, Settings, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface RealtimeHeaderProps {
  isStreaming?: boolean
  onToggleStreaming?: (streaming: boolean) => void
  connectionStatus?: "connected" | "connecting" | "disconnected"
  activeStreams?: number
  latency?: number
}

export function RealtimeHeader({
  isStreaming = true,
  onToggleStreaming,
  connectionStatus = "connected",
  activeStreams = 47,
  latency = 12,
}: RealtimeHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStreamingState, setIsStreaming] = useState(isStreaming)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleToggleStreaming = () => {
    const newState = !isStreamingState
    setIsStreaming(newState)
    onToggleStreaming?.(newState)
  }

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      activeStreams,
      connectionStatus,
      latency,
      exportedBy: "Cyberjaya Smart City System",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `realtime-data-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Real-time Data Center</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={
                    connectionStatus === "connected"
                      ? "default"
                      : connectionStatus === "connecting"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    connectionStatus === "connected"
                      ? "bg-accent text-accent-foreground animate-pulse"
                      : connectionStatus === "connecting"
                        ? "bg-yellow-500 text-white animate-pulse"
                        : "bg-destructive text-destructive-foreground"
                  }
                >
                  {connectionStatus === "connected" && <Activity className="w-3 h-3 mr-1" />}
                  {connectionStatus === "connecting" && <Wifi className="w-3 h-3 mr-1 animate-spin" />}
                  {connectionStatus === "disconnected" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {connectionStatus === "connected" ? "LIVE" : connectionStatus.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {activeStreams} Data Streams {connectionStatus === "connected" ? "Active" : "Available"}
                </span>
                <span className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Wifi
                className={`w-4 h-4 ${connectionStatus === "connected" ? "text-accent" : "text-muted-foreground"}`}
              />
              <span className="text-foreground">
                Connection:{" "}
                {connectionStatus === "connected"
                  ? "Stable"
                  : connectionStatus === "connecting"
                    ? "Connecting..."
                    : "Lost"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Latency: {latency}ms</span>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleExportData} disabled={connectionStatus === "disconnected"}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>

          <Button
            variant={isStreamingState ? "outline" : "default"}
            size="sm"
            onClick={handleToggleStreaming}
            disabled={connectionStatus === "disconnected"}
          >
            {isStreamingState ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume Stream
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
