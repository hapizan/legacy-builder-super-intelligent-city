"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, Settings, Plus, Brain, Zap, Clock, CheckCircle, AlertCircle } from "lucide-react"

const chatHistory = [
  {
    id: "1",
    type: "user",
    message: "What's the current traffic situation in the city center?",
    timestamp: "14:23",
  },
  {
    id: "2",
    type: "ai",
    agent: "Traffic Flow Optimizer",
    message:
      "Current traffic in city center is moderate. I've detected congestion on Jalan Teknologi and have optimized traffic light timing. Expected clearance in 8 minutes.",
    timestamp: "14:23",
    confidence: 94,
  },
  {
    id: "3",
    type: "user",
    message: "Any emergency situations I should be aware of?",
    timestamp: "14:25",
  },
  {
    id: "4",
    type: "ai",
    agent: "Emergency Response Coordinator",
    message:
      "Currently monitoring 1 active fire incident at City Centre Block A. Emergency units are on scene. Evacuation routes have been optimized and 45 people safely evacuated.",
    timestamp: "14:25",
    confidence: 89,
  },
]

const recentTasks = [
  {
    id: "T001",
    agent: "Traffic Flow Optimizer",
    task: "Optimize traffic lights during peak hours",
    status: "completed",
    result: "Reduced congestion by 23%",
    time: "2 minutes ago",
  },
  {
    id: "T002",
    agent: "Energy Grid Manager",
    task: "Balance power distribution across sectors",
    status: "in-progress",
    result: "Processing...",
    time: "5 minutes ago",
  },
  {
    id: "T003",
    agent: "Urban Planning Assistant",
    task: "Analyze zoning efficiency",
    status: "completed",
    result: "Identified 3 optimization opportunities",
    time: "15 minutes ago",
  },
  {
    id: "T004",
    agent: "Infrastructure Monitor",
    task: "Scan for maintenance issues",
    status: "alert",
    result: "Potential pipe leak detected in Sector 5",
    time: "30 minutes ago",
  },
]

export function AIAgentsPanel() {
  const [activeTab, setActiveTab] = useState("chat")
  const [chatMessage, setChatMessage] = useState("")

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle sending message to AI
      setChatMessage("")
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">AI Control Center</h2>
        <p className="text-sm text-muted-foreground">Interact with AI agents and monitor tasks</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="chat" className="space-y-4 mt-0 h-full flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {message.type === "ai" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-medium">{message.agent}</span>
                        {message.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {message.confidence}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask AI agents anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button variant="outline" size="sm" className="text-xs h-6 bg-transparent">
                  Traffic status
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-6 bg-transparent">
                  Energy usage
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-6 bg-transparent">
                  Emergency alerts
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Recent AI Tasks</h3>
              <Badge variant="outline">4 Active</Badge>
            </div>

            <div className="space-y-3">
              {recentTasks.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{task.task}</p>
                        <p className="text-xs text-muted-foreground">{task.agent}</p>
                      </div>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in-progress"
                              ? "secondary"
                              : task.status === "alert"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {task.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {task.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                        {task.status === "alert" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {task.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-foreground">{task.result}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create Custom Task</CardTitle>
                <CardDescription>Assign a specific task to AI agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-agent">Select Agent</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="traffic">Traffic Flow Optimizer</option>
                    <option value="emergency">Emergency Response Coordinator</option>
                    <option value="planning">Urban Planning Assistant</option>
                    <option value="energy">Energy Grid Manager</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Task Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe what you want the AI to analyze or optimize..."
                    rows={3}
                  />
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Task
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-0">
            <h3 className="text-sm font-medium text-foreground">AI Configuration</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Global Settings</CardTitle>
                <CardDescription>Configure AI behavior and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Minimum Confidence Threshold</Label>
                  <Input id="confidence-threshold" type="number" defaultValue="85" min="0" max="100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-actions">Automatic Actions</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="enabled">Enabled</option>
                    <option value="approval">Require Approval</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning-mode">Learning Mode</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="active">Active Learning</option>
                    <option value="passive">Passive Learning</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent Status</CardTitle>
                <CardDescription>Enable or disable individual agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Traffic Flow Optimizer", enabled: true },
                  { name: "Emergency Response Coordinator", enabled: true },
                  { name: "Urban Planning Assistant", enabled: true },
                  { name: "Energy Grid Manager", enabled: true },
                  { name: "Predictive Analytics Engine", enabled: false },
                  { name: "Infrastructure Monitor", enabled: true },
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{agent.name}</span>
                    <Button
                      variant={agent.enabled ? "default" : "outline"}
                      size="sm"
                      className={agent.enabled ? "bg-accent text-accent-foreground" : "bg-transparent"}
                    >
                      {agent.enabled ? <Zap className="w-3 h-3 mr-1" /> : <Brain className="w-3 h-3 mr-1" />}
                      {agent.enabled ? "Active" : "Inactive"}
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
