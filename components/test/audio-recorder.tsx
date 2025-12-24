"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { useTestStore } from "@/lib/stores/test-store"

export function AudioRecorder() {
  const { isRecording, setIsRecording, setAudioBlob, setTranscript, setAudioUrl } = useTestStore()
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      setAudioUrl(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)

        try {
          console.log("[v0] Auto-uploading recorded audio to Blob...")
          const formData = new FormData()
          formData.append("file", blob, `recording-${Date.now()}.webm`)

          const response = await fetch("/api/upload-audio", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            setAudioUrl(data.url)
            console.log("[v0] Audio uploaded to Blob:", data.url)
          }
        } catch (error) {
          console.error("[v0] Failed to upload audio:", error)
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button onClick={startRecording} size="lg" className="gap-2 bg-cyan-500 hover:bg-cyan-600">
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
            </div>
            <Button onClick={stopRecording} size="lg" variant="destructive" className="gap-2">
              <Square className="h-5 w-5" />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
