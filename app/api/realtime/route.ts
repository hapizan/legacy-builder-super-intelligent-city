import { type NextRequest, NextResponse } from "next/server"

// Simulate real-time data endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stream = searchParams.get("stream")

  // Simulate different data streams
  const data = {
    traffic: {
      flow: Math.floor(Math.random() * 2000) + 800,
      congestion: Math.random() * 100,
      incidents: Math.floor(Math.random() * 5),
    },
    energy: {
      consumption: Math.floor(Math.random() * 200) + 700,
      efficiency: Math.random() * 20 + 80,
      renewable: Math.random() * 40 + 30,
    },
    emergency: {
      activeIncidents: Math.floor(Math.random() * 8),
      responseTime: Math.random() * 10 + 5,
      unitsAvailable: Math.floor(Math.random() * 15) + 10,
    },
    environment: {
      airQuality: Math.floor(Math.random() * 50) + 20,
      temperature: Math.random() * 10 + 25,
      humidity: Math.random() * 30 + 60,
    },
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    stream: stream || "all",
    data: stream ? data[stream as keyof typeof data] : data,
    status: "success",
  })
}
