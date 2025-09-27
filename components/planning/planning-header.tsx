"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Download, Upload, Share, History } from "lucide-react"

export function PlanningHeader() {
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
          <div>
            <h1 className="text-xl font-semibold text-foreground">Town Planning</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">Draft</Badge>
              <span className="text-sm text-muted-foreground">Last saved: 2 minutes ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Version History
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Plan
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
        </div>
      </div>
    </header>
  )
}
