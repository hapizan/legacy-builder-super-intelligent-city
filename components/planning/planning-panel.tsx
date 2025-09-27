"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Building2, CheckCircle, Clock, AlertCircle, Plus, Search } from "lucide-react"

const permits = [
  {
    id: "P001",
    title: "New Office Complex - Block C",
    applicant: "Cyberjaya Development Sdn Bhd",
    type: "Commercial",
    status: "pending",
    date: "2024-01-15",
    area: "2.5 acres",
  },
  {
    id: "P002",
    title: "Residential Tower - Phase 2",
    applicant: "Metro Homes Sdn Bhd",
    type: "Residential",
    status: "approved",
    date: "2024-01-10",
    area: "1.8 acres",
  },
  {
    id: "P003",
    title: "Shopping Mall Extension",
    applicant: "Retail Plus Sdn Bhd",
    type: "Commercial",
    status: "review",
    date: "2024-01-20",
    area: "3.2 acres",
  },
]

const scenarios = [
  {
    id: "S001",
    name: "Population Growth 2030",
    description: "Projected 25% population increase",
    impact: "High density residential needed",
    status: "active",
  },
  {
    id: "S002",
    name: "Green Initiative Plan",
    description: "Increase green spaces by 40%",
    impact: "Reduced commercial zones",
    status: "draft",
  },
  {
    id: "S003",
    name: "Tech Hub Expansion",
    description: "New technology corridor",
    impact: "Industrial zone conversion",
    status: "completed",
  },
]

export function PlanningPanel() {
  const [activeTab, setActiveTab] = useState("permits")

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Planning Tools</h2>
        <p className="text-sm text-muted-foreground">Manage permits, scenarios, and zoning</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="permits" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Building Permits</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Permit
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search permits..." className="pl-10" />
            </div>

            <div className="space-y-3">
              {permits.map((permit) => (
                <Card key={permit.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{permit.title}</p>
                          <p className="text-xs text-muted-foreground">{permit.applicant}</p>
                        </div>
                        <Badge
                          variant={
                            permit.status === "approved"
                              ? "default"
                              : permit.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {permit.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {permit.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {permit.status === "review" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {permit.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span>{permit.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{permit.area}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{permit.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Planning Scenarios</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Scenario
              </Button>
            </div>

            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-foreground">{scenario.name}</h4>
                        <Badge variant={scenario.status === "active" ? "default" : "secondary"}>
                          {scenario.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                      <p className="text-xs text-foreground font-medium">Impact: {scenario.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create New Scenario</CardTitle>
                <CardDescription>Simulate planning changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input id="scenario-name" placeholder="Enter scenario name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scenario-desc">Description</Label>
                  <Textarea id="scenario-desc" placeholder="Describe the scenario..." rows={3} />
                </div>
                <Button className="w-full">Create Scenario</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4 mt-0">
            <h3 className="text-sm font-medium text-foreground">Zone Properties</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selected Zone</CardTitle>
                <CardDescription>Edit zone properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zone-name">Zone Name</Label>
                  <Input id="zone-name" defaultValue="City Centre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-type">Zone Type</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="industrial">Industrial</option>
                    <option value="green">Green Space</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="zone-width">Width (m)</Label>
                    <Input id="zone-width" type="number" defaultValue="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zone-height">Height (m)</Label>
                    <Input id="zone-height" type="number" defaultValue="80" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-notes">Notes</Label>
                  <Textarea id="zone-notes" placeholder="Additional notes..." rows={2} />
                </div>
                <Button className="w-full">Update Zone</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
