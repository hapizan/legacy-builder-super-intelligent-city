import { PlanningHeader } from "@/components/planning/planning-header"
import { PlanningMap } from "@/components/planning/planning-map"
import { PlanningToolbar } from "@/components/planning/planning-toolbar"
import { PlanningPanel } from "@/components/planning/planning-panel"

export default function PlanningPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <PlanningHeader />
        <div className="flex-1 flex">
          <div className="flex-1 relative">
            <PlanningToolbar />
            <PlanningMap />
          </div>
          <PlanningPanel />
        </div>
      </div>
    </div>
  )
}
