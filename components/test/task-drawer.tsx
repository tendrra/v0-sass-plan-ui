"use client"

import { useTestStore, type TaskType } from "@/lib/stores/test-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Mic, FileText, Headphones, BookOpen } from "lucide-react"

const tasks = [
  { type: "speaking" as TaskType, label: "Speaking", icon: Mic, color: "bg-orange-500" },
  { type: "writing" as TaskType, label: "Writing", icon: FileText, color: "bg-blue-500" },
  { type: "reading" as TaskType, label: "Reading", icon: BookOpen, color: "bg-green-500" },
  { type: "listening" as TaskType, label: "Listening", icon: Headphones, color: "bg-purple-500" },
]

export function TaskDrawer() {
  const { showTaskDrawer, toggleTaskDrawer, currentTask, setCurrentTask } = useTestStore()

  const handleSelectTask = (task: TaskType) => {
    setCurrentTask(task)
    toggleTaskDrawer()
  }

  return (
    <Sheet open={showTaskDrawer} onOpenChange={toggleTaskDrawer}>
      <SheetContent side="bottom" className="h-[300px]">
        <SheetHeader>
          <SheetTitle>Switch Task</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {tasks.map((task) => {
            const Icon = task.icon
            const isActive = currentTask === task.type

            return (
              <Button
                key={task.type}
                onClick={() => handleSelectTask(task.type)}
                variant={isActive ? "default" : "outline"}
                className={`h-24 flex flex-col gap-2 ${isActive ? task.color : ""}`}
              >
                <Icon className="h-8 w-8" />
                <span className="font-semibold">{task.label}</span>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
