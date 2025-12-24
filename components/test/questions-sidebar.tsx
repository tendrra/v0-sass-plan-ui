"use client"

import { useTestStore } from "@/lib/stores/test-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function QuestionsSidebar() {
  const {
    showQuestionDrawer,
    toggleQuestionDrawer,
    questionList,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setCurrentQuestion,
  } = useTestStore()

  const [filter, setFilter] = useState<"all" | "practiced" | "new">("all")

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setCurrentQuestion(questionList[index])
  }

  if (!showQuestionDrawer) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={toggleQuestionDrawer} />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 w-80 flex flex-col",
          showQuestionDrawer ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <Button variant="ghost" size="icon" onClick={toggleQuestionDrawer}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search questions..." className="pl-9 h-9 text-sm" />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1 h-8 text-xs"
            >
              All
            </Button>
            <Button
              variant={filter === "practiced" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("practiced")}
              className="flex-1 h-8 text-xs"
            >
              Practiced
            </Button>
            <Button
              variant={filter === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("new")}
              className="flex-1 h-8 text-xs"
            >
              New
            </Button>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {questionList.map((question, index) => (
              <button
                key={question.id}
                onClick={() => handleSelectQuestion(index)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 group hover:bg-gray-50",
                  index === currentQuestionIndex && "bg-cyan-50 border border-cyan-200",
                )}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-500">#{index + 1001644}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-orange-100 text-orange-700 border-0">
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-blue-100 text-blue-700 border-0">
                      New
                    </Badge>
                  </div>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">{question.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{question.promptText}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer - Pagination */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-gray-500">Page 1 of 155</span>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
