import { DigitalTwinViewer } from "@/components/digital-twin/digital-twin-viewer"
import { DigitalTwinControls } from "@/components/digital-twin/digital-twin-controls"
import { DigitalTwinSidebar } from "@/components/digital-twin/digital-twin-sidebar"

export default function DigitalTwinPage() {
  return (
    <div className="flex h-screen bg-background">
      <DigitalTwinSidebar />
      <div className="flex-1 flex flex-col">
        <DigitalTwinControls />
        <div className="flex-1 relative">
          <DigitalTwinViewer />
        </div>
      </div>
    </div>
  )
}
