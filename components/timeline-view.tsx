"use client"

import { useEffect, useState } from "react"
import type { Task } from "@/types"
import { formatDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const [timelineTasks, setTimelineTasks] = useState<Task[]>([])
  const [dateRange, setDateRange] = useState<Date[]>([])

  useEffect(() => {
    // Filter tasks with due dates
    const tasksWithDates = tasks.filter((t) => t.dueDate)
    setTimelineTasks(tasksWithDates)

    if (tasksWithDates.length === 0) return

    // Find date range
    let minDate = new Date("9999-12-31")
    let maxDate = new Date("0000-01-01")

    tasksWithDates.forEach((task) => {
      const dueDate = new Date(task.dueDate!)
      if (dueDate < minDate) minDate = dueDate
      if (dueDate > maxDate) maxDate = dueDate
    })

    // If range is invalid, create a small range around today
    if (minDate > maxDate) {
      minDate = new Date()
      maxDate = new Date()
      maxDate.setDate(minDate.getDate() + 7)
    } else {
      // Add some padding to the range
      minDate.setDate(minDate.getDate() - 1)
      maxDate.setDate(maxDate.getDate() + 1)
    }

    // Generate array of dates for the timeline
    const dates: Date[] = []
    const currentDate = new Date(minDate)

    while (currentDate <= maxDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDateRange(dates)
  }, [tasks])

  if (timelineTasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 italic p-4">
        No tasks with due dates found for the timeline.
      </p>
    )
  }

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {}
  timelineTasks.forEach((task) => {
    const dateStr = task.dueDate!
    if (!tasksByDate[dateStr]) {
      tasksByDate[dateStr] = []
    }
    tasksByDate[dateStr].push(task)
  })

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {dateRange.map((date) => {
          const dateStr = date.toISOString().split("T")[0]
          const dayTasks = tasksByDate[dateStr] || []
          const isToday = dateStr === today

          return (
            <div
              key={dateStr}
              className={cn(
                "timeline-day bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex-shrink-0 flex flex-col w-[180px]",
                isToday ? "border-2 border-blue-500" : "",
              )}
            >
              <div className="mb-3 text-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className={cn("font-semibold text-sm", isToday ? "text-blue-600 dark:text-blue-400" : "")}>
                  {formatDate(dateStr, "short")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(dateStr, "weekday")}</p>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 min-h-[100px]">
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => {
                    const priorityColors: Record<string, string> = {
                      high: "border-red-500",
                      medium: "border-yellow-500",
                      low: "border-blue-500",
                      none: "border-gray-300",
                    }
                    const borderColor = priorityColors[task.priority || "none"]

                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "timeline-task-item bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded p-2 text-xs border-l-2",
                          borderColor,
                          task.completed ? "opacity-50 line-through" : "",
                          "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors",
                        )}
                        onClick={() => onTaskClick(task.id)}
                      >
                        {task.title}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500 italic mt-4">No tasks</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
