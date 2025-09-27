"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Zap, Car, TreePine, Wifi, ChevronRight, Eye, EyeOff, Phone, UserCheck, AlertCircle, Volume2 } from "lucide-react"

const layers = [
  { id: "buildings", name: "Buildings", icon: Building2, count: 13, visible: true, color: "#3b82f6" },
  { id: "population", name: "Population Density", icon: Users, count: 65000, visible: true, color: "#10b981" },
  { id: "energy", name: "Energy Grid", icon: Zap, count: 234, visible: false, color: "#f59e0b" },
  { id: "traffic", name: "Traffic Flow", icon: Car, count: 156, visible: true, color: "#ef4444" },
  { id: "green", name: "Green Spaces", icon: TreePine, count: 45, visible: true, color: "#84cc16" },
  { id: "network", name: "Network Coverage", icon: Wifi, count: 89, visible: false, color: "#8b5cf6" },
]

const buildingTypes = [
  { type: "Educational", count: 3, color: "#f59e0b" },
  { type: "Retail", count: 2, color: "#ef4444" },
  { type: "Mixed Use", count: 2, color: "#06b6d4" },
  { type: "Commercial", count: 1, color: "#3b82f6" },
  { type: "Office", count: 1, color: "#10b981" },
  { type: "Residential", count: 1, color: "#8b5cf6" },
  { type: "Hotel", count: 1, color: "#dc2626" },
  { type: "Transport", count: 1, color: "#64748b" },
  { type: "Healthcare", count: 1, color: "#059669" },
]

export function DigitalTwinSidebar() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [streamingMessages, setStreamingMessages] = useState<{[key: number]: string}>({})
  const [currentlyStreaming, setCurrentlyStreaming] = useState<number | null>(null)
  const [displayedMessages, setDisplayedMessages] = useState<typeof conversationMessages>([])
  const [typingIndicator, setTypingIndicator] = useState<'victim' | 'agent' | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callStatus])

  // Format call duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Emergency conversation messages with audio files - sequential flow
  const conversationMessages = [
    { speaker: 'victim', text: 'Hello ! Please help me ! There is a fire in my building at SKY Park, Cyberjaya. I am currently stuck at Level 13. Please help me! Please!', audioFile: '1-ZAM.m4a' },
    { speaker: 'agent', text: 'Hold on Sir, I will provide evacuation plan to you. At the same time, I will lodge report to Fire Department at Cyberjaya.', audioFile: '1-AI.mp3' },
    { speaker: 'victim', text: 'Faster please !', audioFile: '2-ZAM.m4a' },
    { speaker: 'agent', text: 'I understand your situation, sir. Please find at the end side of your floor there will be emergency staircase. Please use the stair to go down. Avoid using lift as it might be disabled due to fire.', audioFile: '2-AI.mp3' },
    { speaker: 'victim', text: 'Alright, I using it Please bear with me.', audioFile: '3-ZAM.m4a' },
    { speaker: 'agent', text: 'Sure sir!', audioFile: '3-AI.mp3' },
    { speaker: 'victim', text: 'Oh no, I am Level 9 but the door is locked !', audioFile: '4-ZAM.m4a' },
    { speaker: 'agent', text: 'Hold on Sir, we are checking the building floorplan.', audioFile: '4-AI.mp3' },
    { speaker: 'victim', text: 'Please hurry up !', audioFile: '5-ZAM.m4a' },
    { speaker: 'agent', text: 'I understand your situation, sir. Your building actually have 2 emergency staircase which is at the end left and right side. Try go to another side.', audioFile: '5-AI.mp3' },
    { speaker: 'victim', text: 'Alright, approaching as per instruction. Please stay with me, I am scared.', audioFile: '6-ZAM.m4a' },
    { speaker: 'agent', text: 'Sure sir ! Calm down and be careful.', audioFile: '6-AI.mp3' },
    { speaker: 'system', text: 'After few minutes...' },
    { speaker: 'victim', text: 'Thank you, i already out of the building.', audioFile: '7-ZAM.m4a' },
    { speaker: 'agent', text: 'Thank God. Please proceed to emergency assembly area nearby the open field in front of the building. Emergency team will do a headcount to ensure all victim in the building are safe.', audioFile: '7-AI.mp3' },
    { speaker: 'victim', text: 'Alright, thank you very much for saving my life.', audioFile: '8-ZAM.m4a' },
    { speaker: 'agent', text: 'As your service, Sir !', audioFile: '8-AI.mp3' }
  ]

  // Stream text character by character with natural voice-to-text simulation
  const streamText = async (text: string, messageIndex: number, audioDuration: number) => {
    console.log(`Starting voice-to-text stream for message ${messageIndex}: "${text.substring(0, 30)}..." - Audio: ${audioDuration}ms`)
    
    const words = text.split(' ')
    // Simulate natural speech-to-text processing: complete within 80% of audio duration
    const streamDuration = audioDuration * 0.8
    const baseWordInterval = Math.max(50, streamDuration / words.length) // Minimum 50ms between words
    
    console.log(`Voice stream settings: ${words.length} words, ${baseWordInterval.toFixed(1)}ms base interval, ${streamDuration.toFixed(1)}ms total`)
    
    setCurrentlyStreaming(messageIndex)
    setStreamingMessages(prev => ({ ...prev, [messageIndex]: '' }))
    
    let accumulatedText = ''
    
    for (let i = 0; i < words.length; i++) {
      if (callStatus !== 'connected') break // Stop if call ends
      
      const word = words[i]
      const isLastWord = i === words.length - 1
      
      // Add natural pauses for punctuation
      let pauseMultiplier = 1
      if (word.includes(',')) pauseMultiplier = 1.3
      if (word.includes('.') || word.includes('!') || word.includes('?')) pauseMultiplier = 1.8
      if (word.includes(':') || word.includes(';')) pauseMultiplier = 1.5
      
      // Simulate word-by-word recognition with character streaming within each word
      const characters = word.split('')
      for (let j = 0; j < characters.length; j++) {
        if (callStatus !== 'connected') break
        
        accumulatedText += characters[j]
        setStreamingMessages(prev => ({ ...prev, [messageIndex]: accumulatedText }))
        
        // Fast character streaming within words (15-25ms per character)
        if (j < characters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 15))
        }
      }
      
      // Add space after word (except for last word)
      if (!isLastWord) {
        accumulatedText += ' '
        setStreamingMessages(prev => ({ ...prev, [messageIndex]: accumulatedText }))
      }
      
      // Pause between words with natural variation
      if (!isLastWord) {
        const wordPause = baseWordInterval * pauseMultiplier * (0.8 + Math.random() * 0.4) // ±20% variation
        await new Promise(resolve => setTimeout(resolve, wordPause))
      }
    }
    
    // Ensure final text is complete and clean
    setStreamingMessages(prev => ({ ...prev, [messageIndex]: text }))
    setCurrentlyStreaming(null)
    console.log(`Voice-to-text streaming completed for message ${messageIndex}`)
  }

  // Start sequential conversation flow
  const startNextMessage = async () => {
    if (currentMessageIndex >= conversationMessages.length || callStatus !== 'connected') {
      return
    }

    const message = conversationMessages[currentMessageIndex]
    
    // Show typing indicator before message appears
    if (message.speaker !== 'system') {
      setTypingIndicator(message.speaker as 'victim' | 'agent')
      await new Promise(resolve => setTimeout(resolve, 800)) // Brief typing delay
      setTypingIndicator(null)
    }
    
    // Add message to displayed messages
    setDisplayedMessages(prev => [...prev, message])
    
    // If message has audio, play it with streaming text
    if (message.audioFile) {
      const audio = new Audio(`/audio/${message.audioFile}`)
      
      audio.onloadedmetadata = () => {
        const audioDuration = audio.duration * 1000 // Convert to milliseconds
        console.log(`Audio duration: ${audioDuration}ms for message: ${message.text.substring(0, 30)}...`)
      }
      
      audio.onplay = () => {
        setIsPlaying(true)
        // Start streaming immediately when audio starts playing
        const audioDuration = audio.duration * 1000
        streamText(message.text, currentMessageIndex, audioDuration)
      }
      
      audio.onended = () => {
        setIsPlaying(false)
        // Ensure full text is displayed when audio ends
        setStreamingMessages(prev => ({ ...prev, [currentMessageIndex]: message.text }))
        setCurrentlyStreaming(null)
        
        // Wait 1 second gap before next message
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
        }, 1000)
      }
      
      audio.onerror = () => {
        console.error(`Failed to load audio: ${message.audioFile}`)
        setIsPlaying(false)
        // Fallback: stream text fast without audio
        streamText(message.text, currentMessageIndex, 2000) // Default 2 second streaming
        
        // Continue to next message after streaming completes
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
        }, 3000)
      }
      
      setCurrentAudio(audio)
      
      // Pre-load audio and start playback
      audio.load()
      audio.play().catch(err => {
        console.error('Audio play failed:', err)
        // Fallback: stream text without audio - very fast
        setIsPlaying(true)
        streamText(message.text, currentMessageIndex, 1500) // Fast 1.5 second streaming
        setTimeout(() => {
          setIsPlaying(false)
          setCurrentMessageIndex(prev => prev + 1)
        }, 2500)
      })
    } else {
      // System message without audio - show for 2 seconds
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1)
      }, 2000)
    }
  }

  // Auto-scroll to bottom when new messages appear or text streams
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [displayedMessages.length, streamingMessages, currentlyStreaming, typingIndicator])

  // Start conversation when connected
  useEffect(() => {
    if (callStatus === 'connected' && currentMessageIndex === 0 && displayedMessages.length === 0) {
      // Start the first message
      startNextMessage()
    }
  }, [callStatus])

  // Continue to next message when currentMessageIndex changes
  useEffect(() => {
    if (callStatus === 'connected' && currentMessageIndex > 0 && currentMessageIndex < conversationMessages.length) {
      startNextMessage()
    }
  }, [currentMessageIndex])

  // Cleanup audio and streaming when call ends
  useEffect(() => {
    if (callStatus === 'ended' || callStatus === 'idle') {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
        setCurrentAudio(null)
      }
      setIsPlaying(false)
      setStreamingMessages({})
      setCurrentlyStreaming(null)
      setTypingIndicator(null)
      setCurrentMessageIndex(0)
      setDisplayedMessages([])
    }
  }, [callStatus])

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">City Layers</h2>
        <p className="text-sm text-muted-foreground">Toggle and explore different city data layers</p>
      </div>

      {/* Call Simulator & Layers */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Emergency Chat Simulator */}
        <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  callStatus === 'connected' ? 'bg-destructive animate-pulse' : 
                  callStatus === 'ringing' ? 'bg-warning animate-bounce' : 
                  'bg-muted-foreground'
                }`} />
                <CardTitle className="text-base text-foreground flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-destructive" />
                  <span>Emergency Chat Monitor</span>
                </CardTitle>
              </div>
              <Badge variant={
                callStatus === 'connected' ? 'destructive' : 
                callStatus === 'ringing' ? 'outline' : 
                callStatus === 'ended' ? 'secondary' : 'outline'
              } className="text-xs">
                {callStatus === 'idle' && 'Ready'}
                {callStatus === 'ringing' && (
                  <span className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-ping" />
                    <span>Connecting</span>
                  </span>
                )}
                {callStatus === 'connected' && (
                  <span className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                    <span>Live</span>
                  </span>
                )}
                {callStatus === 'ended' && 'Complete'}
              </Badge>
            </div>
            <CardDescription className="text-muted-foreground">
              Real-time monitoring of emergency communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Chat Messages Area */}
            <div ref={chatScrollRef} className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-3 h-48 overflow-y-auto space-y-2 shadow-inner">
              {callStatus === 'idle' && (
                <div className="text-center text-muted-foreground text-sm mt-16 flex flex-col items-center space-y-2">
                  <Phone className="w-6 h-6 text-muted-foreground/50" />
                  <span>Click "Start Emergency Call" to begin monitoring</span>
                </div>
              )}
              
              {callStatus === 'ringing' && (
                <div className="text-center text-foreground text-sm mt-16">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Phone className="w-5 h-5 animate-bounce text-destructive" />
                    <span className="animate-pulse font-medium">Incoming Emergency Call...</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
                    <div className="w-1 h-1 bg-warning rounded-full animate-pulse" />
                    <span>Establishing connection</span>
                    <div className="w-1 h-1 bg-warning rounded-full animate-pulse delay-200" />
                  </div>
                </div>
              )}
              
              {callStatus === 'connected' && (
                <>
                  {displayedMessages.map((message, index) => {
                    if (message.speaker === 'system') {
                      return (
                        <div key={index} className="text-center">
                          <div className="text-xs text-muted-foreground italic bg-muted/50 rounded-full px-3 py-1 inline-block border border-border/50">
                            {message.text}
                          </div>
                        </div>
                      )
                    }
                    
                    const isVictim = message.speaker === 'victim'
                    const messageIndex = conversationMessages.findIndex(msg => msg === message)
                    const displayText = streamingMessages[messageIndex] !== undefined 
                      ? streamingMessages[messageIndex] 
                      : message.text
                    const isCurrentlyStreaming = currentlyStreaming === messageIndex
                    
                    return (
                      <div key={index} className={`flex items-start space-x-2 ${!isVictim ? 'justify-end' : ''}`}>
                        {isVictim && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCurrentlyStreaming ? 'bg-destructive/20 animate-pulse' : 'bg-destructive/10'
                          } border border-destructive/20`}>
                            <AlertCircle className="w-3 h-3 text-destructive" />
                          </div>
                        )}
                        <div className="flex-1 max-w-[85%]">
                          <div className={`${
                            isVictim 
                              ? 'bg-destructive/5 border border-destructive/20' 
                              : 'bg-primary/5 border border-primary/20'
                          } rounded-lg p-2 backdrop-blur-sm ${isCurrentlyStreaming ? 'ring-2 ring-opacity-50 ' + (isVictim ? 'ring-destructive/30' : 'ring-primary/30') : ''}`}>
                            <p className={`text-xs font-medium mb-1 ${
                              isVictim 
                                ? 'text-destructive' 
                                : 'text-primary text-right'
                            }`}>
                              {isVictim ? 'Victim' : 'Agentic AI'}
                              {isCurrentlyStreaming && (
                                <span className="ml-2 text-xs animate-pulse flex items-center space-x-1">
                                  <span className="flex items-center space-x-1">
                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
                                  </span>
                                  <span>Voice-to-Text</span>
                                </span>
                              )}
                            </p>
                            <p className={`text-sm ${
                              isVictim ? 'text-foreground' : 'text-foreground'
                            } ${isCurrentlyStreaming ? 'font-medium' : ''}`}>
                              {displayText}
                              {isCurrentlyStreaming && (
                                <span className="inline-flex items-center ml-1">
                                  <span className="inline-block w-0.5 h-4 bg-current animate-pulse">|</span>
                                  <span className="ml-1 text-xs opacity-60">
                                    <span className="inline-block w-1 h-1 bg-current rounded-full animate-ping"></span>
                                  </span>
                                </span>
                              )}
                            </p>
                            <div className={`flex items-center justify-between mt-1`}>
                              <p className={`text-xs ${
                                isVictim 
                                  ? 'text-destructive/70' 
                                  : 'text-primary/70'
                              }`}>
                                {formatDuration(callDuration)}
                              </p>
                              {message.audioFile && (
                                <div className="flex items-center space-x-1">
                                  {isPlaying && currentAudio?.src.includes(message.audioFile) && (
                                    <div className="flex space-x-1">
                                      <div className="w-1 h-2 bg-success animate-pulse rounded"></div>
                                      <div className="w-1 h-3 bg-success/80 animate-pulse rounded delay-75"></div>
                                      <div className="w-1 h-2 bg-success animate-pulse rounded delay-150"></div>
                                    </div>
                                  )}
                                  <Volume2 className="w-3 h-3 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {!isVictim && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                            <UserCheck className="w-3 h-3 text-primary" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {/* Typing Indicator */}
                  {typingIndicator && (
                    <div className={`flex items-start space-x-2 ${typingIndicator === 'agent' ? 'justify-end' : ''}`}>
                      {typingIndicator === 'victim' && (
                        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 border border-destructive/20">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                        </div>
                      )}
                      <div className="flex-1 max-w-[85%]">
                        <div className={`${
                          typingIndicator === 'victim' 
                            ? 'bg-destructive/5 border border-destructive/20' 
                            : 'bg-primary/5 border border-primary/20'
                        } rounded-lg p-2 opacity-80 backdrop-blur-sm`}>
                          <p className={`text-xs font-medium mb-1 ${
                            typingIndicator === 'victim' 
                              ? 'text-destructive' 
                              : 'text-primary text-right'
                          }`}>
                            {typingIndicator === 'victim' ? 'Victim' : 'Agentic AI'}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">Processing voice...</span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {typingIndicator === 'agent' && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                          <UserCheck className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {callStatus === 'ended' && (
                <div className="text-center text-foreground text-sm mt-12 space-y-2">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="font-medium text-success">Emergency call completed successfully</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Victim safely evacuated from Sky Park Cyberjaya</div>
                  <div className="text-xs text-muted-foreground">Total Duration: {formatDuration(callDuration)}</div>
                </div>
              )}
            </div>

            {/* Chat Controls */}
            <div className="flex space-x-2">
              <Button 
                variant={callStatus === 'connected' ? 'destructive' : callStatus === 'ended' ? 'secondary' : 'default'} 
                size="sm" 
                className="flex-1"
                disabled={callStatus === 'ringing' || callStatus === 'ended'}
                onClick={() => {
                  if (callStatus === 'idle') {
                    setCallStatus('ringing')
                    // Simulate dialing and connecting after 3 seconds
                    setTimeout(() => setCallStatus('connected'), 3000)
                  } else if (callStatus === 'connected') {
                    setCallStatus('ended')
                    setTimeout(() => setCallStatus('idle'), 8000)
                  }
                }}
              >
                {callStatus === 'idle' && (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Start Emergency Call
                  </>
                )}
                {callStatus === 'ringing' && (
                  <>
                    <Phone className="w-4 h-4 mr-2 animate-bounce" />
                    Dialing... 🔊
                  </>
                )}
                {callStatus === 'connected' && (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    End Call
                  </>
                )}
                {callStatus === 'ended' && (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Completed
                  </>
                )}
              </Button>
              
              {callStatus === 'connected' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className={isPlaying ? 'animate-pulse bg-green-100' : ''}
                  onClick={() => {
                    if (currentAudio) {
                      if (isPlaying) {
                        currentAudio.pause()
                        setIsPlaying(false)
                      } else {
                        currentAudio.play()
                        setIsPlaying(true)
                      }
                    }
                  }}
                >
                  {isPlaying ? (
                    <Volume2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Duration Display */}
            {callStatus === 'connected' && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3">
                  <p className="text-xs text-gray-500">Chat Duration: {formatDuration(callDuration)}</p>
                  {isPlaying && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Volume2 className="w-3 h-3" />
                      <span className="text-xs animate-pulse">🔊 Playing</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions for Supervisors */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                📍 Locate Caller
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                🚨 Dispatch Unit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Layers</CardTitle>
            <CardDescription>Click to toggle layer visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                  <layer.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{layer.name}</p>
                    <p className="text-xs text-muted-foreground">{layer.count.toLocaleString()} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Building Types</CardTitle>
            <CardDescription>Distribution of building categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {buildingTypes.map((type) => (
              <div key={type.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm text-foreground">{type.type}</span>
                </div>
                <Badge variant="secondary">{type.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Area</span>
              <span className="text-sm font-medium text-foreground">31 km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Population</span>
              <span className="text-sm font-medium text-foreground">~65,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Key Buildings</span>
              <span className="text-sm font-medium text-foreground">13 Modeled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tech Hub Status</span>
              <span className="text-sm font-medium text-foreground">MSC Cybercentre</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
