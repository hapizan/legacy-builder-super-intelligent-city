import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"

export function Header() {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart City Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time monitoring and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <span className="mr-2">🔔</span>
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <span className="mr-2">🔍</span>
            Search
          </Button>
          <Button variant="outline" size="sm">
            <span className="mr-2">📅</span>
            Calendar
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
