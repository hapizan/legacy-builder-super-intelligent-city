"use client"

import { Html, useProgress } from "@react-three/drei"

export function LoadingSpinner() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4 p-8 bg-card/90 backdrop-blur-sm rounded-lg border border-border">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Loading Digital Twin</p>
          <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>
      </div>
    </Html>
  )
}
