import { Sidebar } from "@/components/sidebar"
import { RealtimeHeader } from "@/components/realtime/realtime-header"
import { RealtimeDataGrid } from "@/components/realtime/realtime-data-grid"
import { RealtimePanel } from "@/components/realtime/realtime-panel"

export default function RealtimePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <RealtimeHeader />
        <div className="flex-1 flex">
          <div className="flex-1">
            <RealtimeDataGrid />
          </div>
          <RealtimePanel />
        </div>
      </div>
    </div>
  )
}
