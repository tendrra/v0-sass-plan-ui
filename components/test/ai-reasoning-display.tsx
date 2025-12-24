"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import AILoadingState from "@/components/ui/ai-loading-state"
import { Brain, CheckCircle2 } from "lucide-react"

interface AIReasoningDisplayProps {
  isScoring: boolean
  onComplete?: (scores: any) => void
  transcript: string
  questionText: string
  userId: string
}

export function AIReasoningDisplay({
  isScoring,
  onComplete,
  transcript,
  questionText,
  userId,
}: AIReasoningDisplayProps) {
  const [reasoning, setReasoning] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [scores, setScores] = useState<any>(null)

  useEffect(() => {
    if (!isScoring) {
      setReasoning("")
      setIsComplete(false)
      setScores(null)
      return
    }

    let currentText = ""

    const startStreaming = async () => {
      try {
        const response = await fetch("/api/scoring/speaking-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript,
            questionText,
            userId,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("No reader available")
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)

              if (data === "[DONE]") {
                setIsComplete(true)

                try {
                  const scoreMatch = currentText.match(/SCORES:\s*({[\s\S]*?})/i)
                  if (scoreMatch) {
                    const scoresData = JSON.parse(scoreMatch[1])
                    setScores(scoresData)
                    if (onComplete) {
                      onComplete(scoresData)
                    }
                  }
                } catch (error) {
                  console.error("[v0] Failed to parse scores:", error)
                }
                return
              }

              try {
                const parsed = JSON.parse(data)
                currentText += parsed.text
                setReasoning(currentText)
              } catch (error) {
                // Ignore parse errors
              }
            }
          }
        }
      } catch (error) {
        console.error("[v0] Streaming error:", error)
        setIsComplete(true)
      }
    }

    startStreaming()
  }, [isScoring, transcript, questionText, userId, onComplete])

  if (!isScoring && !reasoning) return null

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* AI Loading Animation */}
      {isScoring && !isComplete && (
        <div className="bg-gradient-to-br from-gray-50 to-white p-8">
          <AILoadingState />
        </div>
      )}

      {/* AI Reasoning */}
      {reasoning && (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="p-2 bg-cyan-100 rounded-full">
                <Brain className="h-5 w-5 text-cyan-600 animate-pulse" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{isComplete ? "Analysis Complete" : "AI is analyzing..."}</h3>
              <p className="text-sm text-gray-500">Real-time reasoning</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">{reasoning}</p>
            {!isComplete && <span className="inline-block w-1.5 h-4 bg-cyan-500 animate-pulse ml-1" />}
          </div>

          {/* Scores */}
          {scores && (
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">{scores.content || 0}</div>
                <div className="text-xs text-gray-600 mt-1">Content</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">{scores.fluency || 0}</div>
                <div className="text-xs text-gray-600 mt-1">Fluency</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">{scores.pronunciation || 0}</div>
                <div className="text-xs text-gray-600 mt-1">Pronunciation</div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
