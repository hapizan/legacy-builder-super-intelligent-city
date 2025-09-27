import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stream = searchParams.get("stream") || "all"

  // Create a readable stream for Server-Sent Events
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      const sendData = () => {
        // Generate real-time data based on stream type
        const generateStreamData = (streamType: string) => {
          const baseData = {
            traffic: {
              flow: Math.floor(Math.random() * 2000) + 800,
              congestion: Math.random() * 100,
              incidents: Math.floor(Math.random() * 5),
              avgSpeed: Math.floor(Math.random() * 40) + 30,
              peakHours: Math.random() > 0.7,
            },
            energy: {
              consumption: Math.floor(Math.random() * 200) + 700,
              efficiency: Math.random() * 20 + 80,
              renewable: Math.random() * 40 + 30,
              gridLoad: Math.random() * 100,
              carbonFootprint: Math.random() * 50 + 20,
            },
            emergency: {
              activeIncidents: Math.floor(Math.random() * 8),
              responseTime: Math.random() * 10 + 5,
              unitsAvailable: Math.floor(Math.random() * 15) + 10,
              severity: Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low",
            },
            environment: {
              airQuality: Math.floor(Math.random() * 50) + 20,
              temperature: Math.random() * 10 + 25,
              humidity: Math.random() * 30 + 60,
              windSpeed: Math.random() * 20 + 5,
              uvIndex: Math.floor(Math.random() * 10) + 1,
            },
            infrastructure: {
              waterPressure: Math.random() * 2 + 3,
              powerGrid: Math.random() * 20 + 80,
              internetSpeed: Math.floor(Math.random() * 500) + 100,
              buildingOccupancy: Math.random() * 40 + 60,
            },
            population: {
              density: Math.floor(Math.random() * 1000) + 2000,
              movement: Math.random() * 100,
              publicTransportUsage: Math.random() * 80 + 20,
              eventActivity: Math.random() > 0.9 ? "high" : "normal",
            },
          }

          return streamType === "all" ? baseData : { [streamType]: baseData[streamType as keyof typeof baseData] }
        }

        const data = {
          timestamp: new Date().toISOString(),
          stream,
          data: generateStreamData(stream),
          status: "live",
          connectionId: Math.random().toString(36).substr(2, 9),
        }

        const sseData = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(sseData))
      }

      // Send initial data
      sendData()

      // Set up interval for continuous data streaming
      const interval = setInterval(sendData, 1000) // Update every second

      // Cleanup function
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
