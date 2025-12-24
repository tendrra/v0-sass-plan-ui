import { create } from "zustand"

export type TaskType = "speaking" | "writing" | "reading" | "listening"

interface Question {
  id: string
  title: string
  type: string
  difficulty: "easy" | "medium" | "hard"
  promptText: string
  promptMediaUrl?: string
}

interface TestState {
  // Current test state
  currentTask: TaskType
  currentQuestion: Question | null
  isRecording: boolean
  isPaused: boolean
  timeRemaining: number

  // Recording state
  audioBlob: Blob | null
  audioUrl: string | null
  transcript: string
  isScoring: boolean

  // Scoring state
  showScoring: boolean
  scoringData: {
    overall: number
    content: number
    fluency: number
    pronunciation: number
    grammar?: number
    vocabulary?: number
  } | null

  // Navigation
  questionList: Question[]
  currentQuestionIndex: number
  showQuestionDrawer: boolean
  showTaskDrawer: boolean

  // Actions
  setCurrentTask: (task: TaskType) => void
  setCurrentQuestion: (question: Question) => void
  setIsRecording: (recording: boolean) => void
  setAudioBlob: (blob: Blob | null) => void
  setAudioUrl: (url: string | null) => void
  setTranscript: (text: string) => void
  setIsScoring: (scoring: boolean) => void
  setShowScoring: (show: boolean) => void
  setScoringData: (data: TestState["scoringData"]) => void
  setQuestionList: (questions: Question[]) => void
  setCurrentQuestionIndex: (index: number) => void
  toggleQuestionDrawer: () => void
  toggleTaskDrawer: () => void
  resetTest: () => void
}

export const useTestStore = create<TestState>((set) => ({
  currentTask: "speaking",
  currentQuestion: null,
  isRecording: false,
  isPaused: false,
  timeRemaining: 0,
  audioBlob: null,
  audioUrl: null,
  transcript: "",
  isScoring: false,
  showScoring: false,
  scoringData: null,
  questionList: [],
  currentQuestionIndex: 0,
  showQuestionDrawer: false,
  showTaskDrawer: false,

  setCurrentTask: (task) => set({ currentTask: task }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setAudioBlob: (blob) => set({ audioBlob: blob }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setTranscript: (text) => set({ transcript: text }),
  setIsScoring: (scoring) => set({ isScoring: scoring }),
  setShowScoring: (show) => set({ showScoring: show }),
  setScoringData: (data) => set({ scoringData: data }),
  setQuestionList: (questions) => set({ questionList: questions }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  toggleQuestionDrawer: () => set((state) => ({ showQuestionDrawer: !state.showQuestionDrawer })),
  toggleTaskDrawer: () => set((state) => ({ showTaskDrawer: !state.showTaskDrawer })),
  resetTest: () =>
    set({
      isRecording: false,
      audioBlob: null,
      audioUrl: null,
      transcript: "",
      showScoring: false,
      scoringData: null,
      isScoring: false,
    }),
}))
