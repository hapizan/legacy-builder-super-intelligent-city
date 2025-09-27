"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Radio, MapPin, Clock, Users, Truck, AlertTriangle, CheckCircle, Plus, Send } from "lucide-react"

const activeIncidents = [
  {
    id: "I001",
    type: "Fire",
    location: "Cyberjaya City Centre, Block A",
    severity: "High",
    status: "Active",
    time: "14:23",
    unitsAssigned: 3,
    evacuated: 45,
    description: "Building fire on 15th floor, smoke detected in stairwells",
  },
  {
    id: "I002",
    type: "Power Outage",
    location: "Residential Sector 7",
    severity: "Medium",
    status: "Responding",
    time: "14:15",
    unitsAssigned: 2,
    affected: 156,
    description: "Transformer failure affecting 6 residential buildings",
  },
]

const emergencyUnits = [
  { id: "Fire-1", type: "Fire Truck", status: "On Scene", location: "City Centre", crew: 4 },
  { id: "Fire-2", type: "Fire Truck", status: "Dispatched", location: "En Route", crew: 4 },
  { id: "Police-1", type: "Police Unit", status: "Available", location: "Station 3", crew: 2 },
  { id: "Ambulance-1", type: "Ambulance", status: "Dispatched", location: "En Route", crew: 3 },
  { id: "Utility-1", type: "Utility Truck", status: "On Scene", location: "Sector 7", crew: 2 },
]

export function EmergencyPanel() {
  const [activeTab, setActiveTab] = useState("incidents")

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Emergency Control</h2>
        <p className="text-sm text-muted-foreground">Manage incidents and coordinate response</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="incidents" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Active Incidents</h3>
              <Button size="sm" variant="destructive">
                <Plus className="w-4 h-4 mr-2" />
                New Incident
              </Button>
            </div>

            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <Card key={incident.id} className="border-destructive/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <h4 className="text-sm font-medium text-foreground">{incident.type}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">{incident.location}</p>
                        </div>
                        <Badge variant={incident.severity === "High" ? "destructive" : "secondary"}>
                          {incident.severity}
                        </Badge>
                      </div>

                      <p className="text-xs text-foreground">{incident.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{incident.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Truck className="w-3 h-3 text-muted-foreground" />
                          <span>{incident.unitsAssigned} Units</span>
                        </div>
                        {incident.evacuated && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>{incident.evacuated} Evacuated</span>
                          </div>
                        )}
                        {incident.affected && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>{incident.affected} Affected</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <MapPin className="w-3 h-3 mr-1" />
                          Locate
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Radio className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="units" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Emergency Units</h3>
              <Badge variant="outline">5 Active</Badge>
            </div>

            <div className="space-y-3">
              {emergencyUnits.map((unit) => (
                <Card key={unit.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{unit.id}</span>
                        </div>
                        <Badge
                          variant={
                            unit.status === "Available"
                              ? "default"
                              : unit.status === "Dispatched"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {unit.status === "On Scene" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {unit.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{unit.type}</p>
                        <div className="flex items-center justify-between">
                          <span>{unit.location}</span>
                          <span>{unit.crew} crew members</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Radio className="w-3 h-3 mr-1" />
                          Radio
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <MapPin className="w-3 h-3 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-4 mt-0">
            <h3 className="text-sm font-medium text-foreground">Emergency Dispatch</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Emergency Call</CardTitle>
                <CardDescription>Report and dispatch emergency response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-type">Emergency Type</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="fire">Fire</option>
                    <option value="medical">Medical</option>
                    <option value="police">Police</option>
                    <option value="utility">Utility</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter incident location" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the emergency situation..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caller">Caller Information</Label>
                  <Input id="caller" placeholder="Name and contact number" />
                </div>

                <Button className="w-full" variant="destructive">
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Emergency Response
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Hotline
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Radio className="w-4 h-4 mr-2" />
                  All Units Broadcast
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  City-wide Alert
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
