"use client"

import { useTestStore } from "@/lib/stores/test-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Share2, Play } from "lucide-react"

export function ScoringModal() {
  const { showScoring, setShowScoring, scoringData, transcript } = useTestStore()

  if (!scoringData) return null

  return (
    <Dialog open={showScoring} onOpenChange={setShowScoring}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-cyan-600">AI Score</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowScoring(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">alfapte.com</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500">{scoringData.overall}</div>
              <p className="text-sm text-muted-foreground">Out of 90</p>
            </div>
          </div>

          {/* Enabling Skills Section */}
          <div>
            <h3 className="font-semibold mb-4 py-2 text-center bg-cyan-500 text-white rounded">Enabling Skills</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Content</span>
                  <span className="text-sm font-medium">{scoringData.content}/90</span>
                </div>
                <Progress value={(scoringData.content / 90) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fluency</span>
                  <span className="text-sm font-medium">{scoringData.fluency}/90</span>
                </div>
                <Progress value={(scoringData.fluency / 90) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pronunciation</span>
                  <span className="text-sm font-medium">{scoringData.pronunciation}/90</span>
                </div>
                <Progress value={(scoringData.pronunciation / 90) * 100} className="h-2" />
              </div>

              {scoringData.grammar && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Grammar</span>
                    <span className="text-sm font-medium">{scoringData.grammar}/90</span>
                  </div>
                  <Progress value={(scoringData.grammar / 90) * 100} className="h-2" />
                </div>
              )}

              {scoringData.vocabulary && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Vocabulary</span>
                    <span className="text-sm font-medium">{scoringData.vocabulary}/90</span>
                  </div>
                  <Progress value={(scoringData.vocabulary / 90) * 100} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Audio Player Placeholder */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="rounded-full">
                <Play className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded relative">
                  <div className="absolute left-0 top-0 h-full bg-cyan-400 rounded" style={{ width: "30%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>00:00</span>
                  <span>00:00</span>
                </div>
              </div>
              <span className="text-sm font-medium text-cyan-600">1.0x</span>
              <Button size="icon" variant="ghost">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* AI Speech to Text Section */}
          <div>
            <div className="flex items-center justify-between mb-3 bg-cyan-500 text-white py-2 px-4 rounded">
              <h3 className="font-semibold">AI Speech to Text</h3>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-cyan-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
              {transcript || "No transcript available"}
            </div>

            <div className="flex justify-between mt-3 text-sm">
              <span className="text-green-600 font-medium">Good: 2 words</span>
              <span className="text-yellow-600 font-medium">Average: 1 word</span>
              <span className="text-red-600 font-medium">Bad/Missed: 67 words</span>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">This score will disappear on 24/02/2026</p>
          </div>

          {/* AI Scoring Notice */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <p className="text-xs text-cyan-800">
              <strong>AI Scoring is available once you submit your response.</strong>
            </p>
            <p className="text-xs text-cyan-700 mt-1">
              Are you using headsets? Always use headsets with microphone to get an accurate AI score.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
