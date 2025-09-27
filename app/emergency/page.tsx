import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { EmergencyMap } from "@/components/emergency/emergency-map"
import { EmergencyPanel } from "@/components/emergency/emergency-panel"
import { EmergencyAlerts } from "@/components/emergency/emergency-alerts"

export default function EmergencyPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <EmergencyHeader />
        <EmergencyAlerts />
        <div className="flex-1 flex">
          <div className="flex-1 relative">
            <EmergencyMap />
          </div>
          <EmergencyPanel />
        </div>
      </div>
    </div>
  )
}
