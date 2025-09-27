"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface RealtimeDataHook {
  data: any
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected"
  latency: number
  error: string | null
  reconnect: () => void
  disconnect: () => void
}

export function useRealtimeData(stream = "all", autoConnect = true): RealtimeDataHook {
  const [data, setData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const [latency, setLatency] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setConnectionStatus("connecting")
    setError(null)

    try {
      eventSourceRef.current = new EventSource(`/api/realtime/websocket?stream=${stream}`)

      const startTime = Date.now()

      eventSourceRef.current.onopen = () => {
        setConnectionStatus("connected")
        setIsConnected(true)
        setLatency(Date.now() - startTime)
        console.log("[v0] Real-time data connection established")
      }

      eventSourceRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data)
          setData(parsedData)
          setLatency(Date.now() - new Date(parsedData.timestamp).getTime())
        } catch (err) {
          console.error("[v0] Error parsing real-time data:", err)
          setError("Failed to parse incoming data")
        }
      }

      eventSourceRef.current.onerror = () => {
        setConnectionStatus("disconnected")
        setIsConnected(false)
        setError("Connection lost")
        console.log("[v0] Real-time data connection lost")

        // Auto-reconnect after 3 seconds
        if (autoConnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 3000)
        }
      }
    } catch (err) {
      setError("Failed to establish connection")
      setConnectionStatus("disconnected")
    }
  }, [stream, autoConnect])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setConnectionStatus("disconnected")
    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(() => connect(), 100)
  }, [connect, disconnect])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [connect, disconnect, autoConnect])

  return {
    data,
    isConnected,
    connectionStatus,
    latency,
    error,
    reconnect,
    disconnect,
  }
}
