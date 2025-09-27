"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Radio, AlertTriangle, Users, MapPin } from "lucide-react"

export function EmergencyHeader() {
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
            <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Emergency Response Center</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="destructive" className="animate-pulse">
                  ACTIVE
                </Badge>
                <span className="text-sm text-muted-foreground">3 Active Incidents</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">12 Units</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">5 Zones</span>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Radio className="w-4 h-4 mr-2" />
            Dispatch
          </Button>
          <Button variant="destructive" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Emergency Call
          </Button>
        </div>
      </div>
    </header>
  )
}
