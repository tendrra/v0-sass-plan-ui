"use client"

import { useTestStore } from "@/lib/stores/test-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookmarkIcon, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

export function QuestionDrawer() {
  const {
    showQuestionDrawer,
    toggleQuestionDrawer,
    questionList,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setCurrentQuestion,
  } = useTestStore()

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setCurrentQuestion(questionList[index])
    toggleQuestionDrawer()
  }

  return (
    <Sheet open={showQuestionDrawer} onOpenChange={toggleQuestionDrawer}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-orange-500">Read Aloud</SheetTitle>
          <Button variant="outline" size="sm" className="w-fit bg-transparent">
            Reset Practice
          </Button>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Filter Options */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              All
            </Button>
            <Button variant="outline" size="sm">
              Practiced
            </Button>
            <Button variant="outline" size="sm">
              Not Practiced
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Content / Title / Number" className="pl-9" />
            </div>
            <Button size="icon" variant="outline">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </div>

          {/* Additional Filters */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Prediction
            </Button>
            <Button variant="outline" size="sm">
              Bookmark
            </Button>
            <Button variant="outline" size="sm">
              Level
            </Button>
          </div>

          {/* Question Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">1548 Questions</span>
            </div>
            <span className="text-sm text-muted-foreground">(New to old)</span>
          </div>

          {/* Question List */}
          <div className="space-y-2">
            {questionList.map((question, index) => (
              <button
                key={question.id}
                onClick={() => handleSelectQuestion(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  index === currentQuestionIndex
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-cyan-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-600">#{index + 1001644}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Medium
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      New
                    </Badge>
                    <Badge variant="outline">Appeared (2)</Badge>
                    <BookmarkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <h3 className="font-medium text-sm mb-1">{question.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{question.promptText}</p>
              </button>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" className="bg-cyan-500">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
              <span className="px-2">...</span>
              <Button variant="outline" size="sm">
                155
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>

          {/* Go To Page */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">GO TO</span>
            <Input className="w-20 text-center" />
            <span className="text-sm">/ 155</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
