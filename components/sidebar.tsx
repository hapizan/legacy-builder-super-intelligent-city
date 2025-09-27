"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Digital Twin", href: "/digital-twin", icon: "🏢" },
  { name: "Emergency", href: "/emergency", icon: "🚨" },
  { name: "AI Agents", href: "/ai-agents", icon: "🤖" },
  { name: "Real-time Data", href: "/realtime", icon: "📊" },
  { name: "Town Planning", href: "/planning", icon: "📍" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🏙️</span>
          <div>
            <h1 className="text-xl font-bold text-foreground">Cyberjaya</h1>
            <p className="text-sm text-muted-foreground">Smart City System</p>
          </div>
        </div>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
