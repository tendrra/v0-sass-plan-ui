// Type definitions for the platform

export type TaskType = "speaking" | "writing" | "reading" | "listening"

export type Difficulty = "easy" | "medium" | "hard"

export type QuestionType =
  | "read_aloud"
  | "repeat_sentence"
  | "describe_image"
  | "retell_lecture"
  | "answer_short_question"
  | "summarize_written_text"
  | "essay"

export interface Question {
  id: string
  title: string
  type: QuestionType
  promptText: string
  promptMediaUrl?: string
  difficulty: Difficulty
  tags?: string[]
  metadata?: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface SpeakingAttempt {
  id: string
  userId: string
  questionId: string
  audioUrl?: string
  transcript?: string
  type?: QuestionType
  durationMs?: number
  overallScore?: number
  contentScore?: number
  fluencyScore?: number
  pronunciationScore?: number
  wordsPerMinute?: string
  fillerRate?: string
  scores?: Record<string, any>
  timings?: Record<string, any>
  isPublic: boolean
  createdAt: Date
}

export interface WritingAttempt {
  id: string
  userId: string
  questionId: string
  userResponse: string
  wordCount?: number
  timeTaken?: number
  overallScore?: number
  contentScore?: number
  grammarScore?: number
  vocabularyScore?: number
  coherenceScore?: number
  scores?: Record<string, any>
  createdAt: Date
  updatedAt?: Date
}

export interface ScoringResult {
  overallScore: number
  content: number
  fluency?: number
  pronunciation?: number
  grammar?: number
  vocabulary?: number
  coherence?: number
  wordsPerMinute?: number
  fillerWordCount?: number
  feedback: {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
  }
  transcriptAnalysis?: {
    correctWords: number
    totalWords: number
    missedWords: string[]
  }
  detailedAnalysis?: {
    taskResponse: string
    grammarIssues: string[]
    vocabularyHighlights: string[]
    coherenceNotes: string
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  aiCreditsUsed: number
  dailyAiCredits: number
  practiceQuestionsUsed: number
  dailyPracticeLimit: number
  lastCreditReset?: Date
  lastPracticeReset?: Date
  createdAt: Date
  updatedAt?: Date
}
