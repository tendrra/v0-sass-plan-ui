// Audio utility functions

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function calculateWordsPerMinute(wordCount: number, durationMs: number): number {
  const minutes = durationMs / 60000
  return Math.round(wordCount / minutes)
}

export function detectFillerWords(transcript: string): string[] {
  const fillerWords = ["um", "uh", "like", "you know", "actually", "basically", "literally"]
  const words = transcript.toLowerCase().split(/\s+/)
  return words.filter((word) => fillerWords.includes(word))
}

export function analyzeTranscript(transcript: string, referenceText: string) {
  const transcriptWords = transcript.toLowerCase().split(/\s+/)
  const referenceWords = referenceText.toLowerCase().split(/\s+/)

  const correctWords = transcriptWords.filter((word, index) => word === referenceWords[index])

  const missedWords = referenceWords.filter((word, index) => word !== transcriptWords[index])

  return {
    correctWords: correctWords.length,
    totalWords: referenceWords.length,
    accuracy: (correctWords.length / referenceWords.length) * 100,
    missedWords,
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      resolve(base64.split(",")[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
