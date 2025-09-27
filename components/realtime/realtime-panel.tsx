"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Activity, Wifi, Database, Settings, AlertTriangle, CheckCircle, Clock, Zap, Trash2 } from "lucide-react"

interface ConnectionStatus {
  status: "connected" | "warning" | "disconnected"
  latency: number
  uptime: string
  lastUpdate?: string
}

interface RealtimeEvent {
  id: string
  timestamp: string
  type: "alert" | "update" | "system" | "error"
  source: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  acknowledged?: boolean
}

const initialConnectionStatus: Record<string, ConnectionStatus> = {
  websocket: { status: "connected", latency: 12, uptime: "99.9%", lastUpdate: "now" },
  database: { status: "connected", latency: 8, uptime: "100%", lastUpdate: "2s ago" },
  sensors: { status: "connected", latency: 15, uptime: "98.7%", lastUpdate: "1s ago" },
  apis: { status: "warning", latency: 45, uptime: "97.2%", lastUpdate: "5s ago" },
}

const initialEvents: RealtimeEvent[] = [
  {
    id: "1",
    timestamp: "14:23:45",
    type: "alert",
    source: "Traffic Sensor Network",
    message: "High congestion detected on Jalan Teknologi",
    severity: "medium",
    acknowledged: false,
  },
  {
    id: "2",
    timestamp: "14:22:12",
    type: "update",
    source: "Energy Grid Monitor",
    message: "Power consumption decreased by 5% in Sector 7",
    severity: "low",
    acknowledged: true,
  },
  {
    id: "3",
    timestamp: "14:21:33",
    type: "alert",
    source: "Emergency System",
    message: "Fire alarm triggered at City Centre Block A",
    severity: "high",
    acknowledged: false,
  },
  {
    id: "4",
    timestamp: "14:20:58",
    type: "update",
    source: "Water Management",
    message: "Water pressure normalized in residential areas",
    severity: "low",
    acknowledged: true,
  },
  {
    id: "5",
    timestamp: "14:19:45",
    type: "system",
    source: "AI Traffic Optimizer",
    message: "Traffic light timing optimized for peak hour",
    severity: "low",
    acknowledged: true,
  },
]

export function RealtimePanel() {
  const [activeTab, setActiveTab] = useState("status")
  const [connectionStatus, setConnectionStatus] = useState(initialConnectionStatus)
  const [events, setEvents] = useState<RealtimeEvent[]>(initialEvents)
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoAcknowledge, setAutoAcknowledge] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus((prev) => ({
        ...prev,
        websocket: {
          ...prev.websocket,
          latency: Math.floor(Math.random() * 20) + 8,
          lastUpdate: "now",
        },
        database: {
          ...prev.database,
          latency: Math.floor(Math.random() * 15) + 5,
          lastUpdate: Math.random() > 0.7 ? "now" : "1s ago",
        },
        sensors: {
          ...prev.sensors,
          latency: Math.floor(Math.random() * 25) + 10,
          status: Math.random() > 0.95 ? "warning" : "connected",
          lastUpdate: "now",
        },
        apis: {
          ...prev.apis,
          latency: Math.floor(Math.random() * 30) + 30,
          status: Math.random() > 0.9 ? "warning" : "connected",
          lastUpdate: Math.random() > 0.8 ? "now" : "3s ago",
        },
      }))

      if (Math.random() > 0.85) {
        const newEvent: RealtimeEvent = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          type: Math.random() > 0.7 ? "alert" : Math.random() > 0.5 ? "update" : "system",
          source: ["Traffic System", "Energy Grid", "Water Management", "Emergency Services", "AI Controller"][
            Math.floor(Math.random() * 5)
          ],
          message: "System status update received",
          severity: Math.random() > 0.8 ? "high" : Math.random() > 0.6 ? "medium" : "low",
          acknowledged: autoAcknowledge,
        }

        setEvents((prev) => [newEvent, ...prev.slice(0, 19)]) // Keep only latest 20 events
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [autoAcknowledge])

  const handleAcknowledgeEvent = (eventId: string) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, acknowledged: true } : event)))
  }

  const handleClearEvents = () => {
    setEvents([])
  }

  const filteredEvents = events.filter((event) => {
    if (eventFilter === "all") return true
    if (eventFilter === "unacknowledged") return !event.acknowledged
    return event.severity === eventFilter
  })

  const unacknowledgedCount = events.filter((e) => !e.acknowledged).length

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Data Stream Control</h2>
        <p className="text-sm text-muted-foreground">Monitor connections and configure streams</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="events" className="relative">
            Events
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                {unacknowledgedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="status" className="space-y-4 mt-0">
            <h3 className="text-sm font-medium text-foreground">Connection Status</h3>

            <div className="space-y-3">
              {Object.entries(connectionStatus).map(([key, connection]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {key === "websocket" && <Wifi className="w-4 h-4 text-muted-foreground" />}
                          {key === "database" && <Database className="w-4 h-4 text-muted-foreground" />}
                          {key === "sensors" && <Activity className="w-4 h-4 text-muted-foreground" />}
                          {key === "apis" && <Zap className="w-4 h-4 text-muted-foreground" />}
                          <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                        </div>
                        <Badge
                          variant={
                            connection.status === "connected"
                              ? "default"
                              : connection.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            connection.status === "connected"
                              ? "bg-accent text-accent-foreground"
                              : connection.status === "warning"
                                ? "bg-yellow-500 text-white"
                                : ""
                          }
                        >
                          {connection.status === "connected" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {connection.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {connection.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span>Latency: </span>
                          <span className="font-medium">{connection.latency}ms</span>
                        </div>
                        <div>
                          <span>Uptime: </span>
                          <span className="font-medium">{connection.uptime}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">Last update: {connection.lastUpdate}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Health</CardTitle>
                <CardDescription>Overall system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Throughput</span>
                  <span className="font-medium text-foreground">2.4 MB/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Connections</span>
                  <span className="font-medium text-foreground">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className="font-medium text-accent">0.02%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPU Usage</span>
                  <span className="font-medium text-foreground">23%</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Real-time Events</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="text-xs bg-background border border-border rounded px-2 py-1"
                >
                  <option value="all">All Events</option>
                  <option value="unacknowledged">Unacknowledged</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleClearEvents}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents.map((event) => (
                <Card key={event.id} className={`p-3 ${!event.acknowledged ? "border-l-4 border-l-accent" : ""}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          {event.type === "alert" && <AlertTriangle className="w-3 h-3 text-destructive" />}
                          {event.type === "update" && <CheckCircle className="w-3 h-3 text-accent" />}
                          {event.type === "system" && <Activity className="w-3 h-3 text-primary" />}
                          {event.type === "error" && <AlertTriangle className="w-3 h-3 text-destructive" />}
                          <span className="text-xs font-medium text-foreground">{event.source}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.message}</p>
                        {!event.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 bg-transparent"
                            onClick={() => handleAcknowledgeEvent(event.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            event.severity === "high" || event.severity === "critical"
                              ? "destructive"
                              : event.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {event.severity}
                        </Badge>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-0">
            <h3 className="text-sm font-medium text-foreground">Stream Configuration</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Settings</CardTitle>
                <CardDescription>Configure alert and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-ack">Auto-acknowledge Low Priority</Label>
                  <Switch id="auto-ack" checked={autoAcknowledge} onCheckedChange={setAutoAcknowledge} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Update Intervals</CardTitle>
                <CardDescription>Configure data refresh rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="traffic-interval">Traffic Data (seconds)</Label>
                  <Input id="traffic-interval" type="number" defaultValue="2" min="1" max="60" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="energy-interval">Energy Data (seconds)</Label>
                  <Input id="energy-interval" type="number" defaultValue="5" min="1" max="60" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-interval">Emergency Data (seconds)</Label>
                  <Input id="emergency-interval" type="number" defaultValue="1" min="1" max="10" />
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Apply Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Sources</CardTitle>
                <CardDescription>Enable or disable data streams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Traffic Sensors", enabled: true },
                  { name: "Energy Meters", enabled: true },
                  { name: "Weather Stations", enabled: true },
                  { name: "Security Cameras", enabled: false },
                  { name: "Air Quality Monitors", enabled: true },
                  { name: "Water Flow Sensors", enabled: true },
                ].map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{source.name}</span>
                    <Button
                      variant={source.enabled ? "default" : "outline"}
                      size="sm"
                      className={source.enabled ? "bg-accent text-accent-foreground" : "bg-transparent"}
                    >
                      {source.enabled ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Activity className="w-3 h-3 mr-1" />
                      )}
                      {source.enabled ? "Active" : "Inactive"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
