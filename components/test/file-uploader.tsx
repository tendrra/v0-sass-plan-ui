"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X, Loader2 } from "lucide-react"
import { useTestStore } from "@/lib/stores/test-store"

export function FileUploader() {
  const { setAudioBlob, setAudioUrl } = useTestStore()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)

    try {
      console.log("[v0] Uploading file to Blob:", file.name)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      console.log("[v0] Upload successful:", data.url)

      setUploadedFile({ name: data.filename, url: data.url })
      setAudioUrl(data.url)
      setAudioBlob(file)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setAudioUrl(null)
    setAudioBlob(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        id="audio-file-input"
      />

      {!uploadedFile ? (
        <label htmlFor="audio-file-input">
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 bg-transparent"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Audio File
              </>
            )}
          </Button>
        </label>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
          <File className="h-5 w-5 text-cyan-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cyan-900 truncate">{uploadedFile.name}</p>
            <p className="text-xs text-cyan-600">Uploaded successfully</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">Supported formats: MP3, WAV, M4A, WebM (Max 10MB)</p>
    </div>
  )
}
