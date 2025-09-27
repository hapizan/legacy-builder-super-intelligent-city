import { AIAgentsHeader } from "@/components/ai-agents/ai-agents-header"
import { AIAgentsDashboard } from "@/components/ai-agents/ai-agents-dashboard"
import { AIAgentsPanel } from "@/components/ai-agents/ai-agents-panel"

export default function AIAgentsPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <AIAgentsHeader />
        <div className="flex-1 flex">
          <div className="flex-1">
            <AIAgentsDashboard />
          </div>
          <AIAgentsPanel />
        </div>
      </div>
    </div>
  )
}
