"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Zap, Brain, Settings, Pause } from "lucide-react"

export function AIAgentsHeader() {
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
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Agent Framework</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  <Zap className="w-3 h-3 mr-1" />
                  ACTIVE
                </Badge>
                <span className="text-sm text-muted-foreground">7 Agents Running</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">AI Processing: 94%</span>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
        </div>
      </div>
    </header>
  )
}
