"use client"

import { useEffect, useState } from "react"
import { useTestStore } from "@/lib/stores/test-store"
import { AudioRecorder } from "@/components/test/audio-recorder"
import { FileUploader } from "@/components/test/file-uploader"
import { AIReasoningDisplay } from "@/components/test/ai-reasoning-display"
import { ScoringModal } from "@/components/test/scoring-modal"
import { QuestionsSidebar } from "@/components/test/questions-sidebar"
import { TaskDrawer } from "@/components/test/task-drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Volume2, ChevronRight, CircleHelp, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SpeakingTestPage() {
  const {
    currentQuestion,
    setCurrentQuestion,
    setQuestionList,
    audioBlob,
    audioUrl,
    transcript,
    isScoring,
    setIsScoring,
    setShowScoring,
    setScoringData,
    setTranscript,
    toggleQuestionDrawer,
    toggleTaskDrawer,
    resetTest,
  } = useTestStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timer, setTimer] = useState(35)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    // Load questions
    fetch("/api/questions/speaking")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        if (data.questions?.length > 0) {
          setQuestionList(data.questions)
          setCurrentQuestion(data.questions[0])
        }
      })
      .catch((error) => {
        console.error("[v0] Error loading questions:", error)
      })
  }, [setQuestionList, setCurrentQuestion])

  const handleSubmit = async () => {
    if (!audioBlob || !currentQuestion) return

    setIsSubmitting(true)
    setIsScoring(true)

    try {
      // Upload audio if needed
      let uploadedUrl = audioUrl
      if (!uploadedUrl) {
        const formData = new FormData()
        formData.append("file", audioBlob)
        const uploadRes = await fetch("/api/upload-audio", { method: "POST", body: formData })
        if (!uploadRes.ok) throw new Error("Failed to upload audio")
        const uploadData = await uploadRes.json()
        uploadedUrl = uploadData.url
      }

      // Transcribe
      const formData = new FormData()
      formData.append("audio", audioBlob)
      const transcriptRes = await fetch("/api/transcribe", { method: "POST", body: formData })
      if (!transcriptRes.ok) throw new Error("Failed to transcribe audio")
      const transcriptData = await transcriptRes.json()
      setTranscript(transcriptData.transcript)
    } catch (error) {
      console.error("[v0] Error submitting:", error)
      alert(error instanceof Error ? error.message : "Failed to submit")
      setIsScoring(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScoringComplete = (scores: any) => {
    setScoringData({
      overall: Math.round((scores.content + scores.fluency + scores.pronunciation) / 3),
      content: scores.content,
      fluency: scores.fluency,
      pronunciation: scores.pronunciation,
    })
    setIsScoring(false)
    setShowScoring(true)
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent" />
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleQuestionDrawer} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Speaking Test</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-cyan-100 text-cyan-700 border-0">
                PTE A / UKVI
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-sm">
                <CircleHelp className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <QuestionsSidebar />
          </div>

          {/* Main Column */}
          <div className="space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Volume2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Read Aloud</h2>
                      <p className="text-xs text-cyan-100">#{currentQuestion.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 border-0 text-white">Medium</Badge>
                    <Badge className="bg-white/20 border-0 text-white">New</Badge>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Look at the text below. In 35 seconds, you must read this text aloud as naturally and clearly as
                  possible. You have 35 seconds to read aloud.
                </p>
              </div>

              {/* Question Text */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-cyan-900 mb-3">{currentQuestion.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{currentQuestion.promptText}</p>
                </div>

                {/* Recording Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setShowUpload(false)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        !showUpload
                          ? "text-cyan-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-600"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      Record Audio
                    </button>
                    <button
                      onClick={() => setShowUpload(true)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        showUpload
                          ? "text-cyan-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-600"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      <Upload className="h-4 w-4 inline mr-2" />
                      Upload File
                    </button>
                  </div>

                  {!showUpload ? (
                    <div className="py-4">
                      <AudioRecorder />
                    </div>
                  ) : (
                    <div className="py-4">
                      <FileUploader />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!audioBlob || isSubmitting || isScoring}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-sm"
                  >
                    {isSubmitting || isScoring ? "Processing..." : "Submit & Score"}
                  </Button>
                  <Button variant="outline" onClick={resetTest}>
                    Redo
                  </Button>
                  <Button variant="outline" className="ml-auto bg-transparent">
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Reasoning Display */}
            {transcript && (
              <AIReasoningDisplay
                isScoring={isScoring}
                onComplete={handleScoringComplete}
                transcript={transcript}
                questionText={currentQuestion?.promptText || ""}
                userId="user123"
              />
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
              <div className="flex gap-4">
                <div className="p-2 bg-cyan-500 rounded-lg h-fit">
                  <CircleHelp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-cyan-900 mb-2">AI Scoring Available</h4>
                  <p className="text-sm text-cyan-700 leading-relaxed">
                    AI scoring is available once you submit your response. For best results, use headsets with a
                    microphone to get an accurate AI score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ScoringModal />
      <TaskDrawer />
    </div>
  )
}
