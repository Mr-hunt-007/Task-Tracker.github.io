"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  tasks: Task[]
  currentDate: Date
  onDateChange: (date: Date) => void
  onTaskClick: (taskId: string) => void
  onAddTask: () => void
}

export function CalendarView({ tasks, currentDate, onDateChange, onTaskClick, onAddTask }: CalendarViewProps) {
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date | null; tasks: Task[] }>>([])

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, tasks])

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Last day of the month (28-31)
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()

    const days: Array<{ date: Date | null; tasks: Task[] }> = []

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null, tasks: [] })
    }

    // Add cells for each day of the month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split("T")[0]

      // Find tasks for this day
      const dayTasks = tasks.filter((task) => task.dueDate === dateStr)

      days.push({ date, tasks: dayTasks })
    }

    // Add empty cells to complete the grid (if needed)
    const totalCells = days.length
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)

    for (let i = 0; i < remainingCells; i++) {
      days.push({ date: null, tasks: [] })
    }

    setCalendarDays(days)
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const getMonthYearString = () => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">{getMonthYearString()}</h3>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="link"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-4"
            onClick={goToToday}
          >
            Today
          </Button>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 opacity-50 cursor-not-allowed">
          <Button variant="ghost" size="sm" className="rounded-md">
            Month
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md">
            Week
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md">
            Day
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-750 py-2 text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 min-h-[400px]">
          {calendarDays.map((day, index) => {
            if (!day.date) {
              return <div key={`empty-${index}`} className="bg-gray-50 dark:bg-gray-800/50 h-24 sm:h-32" />
            }

            const dateStr = day.date.toISOString().split("T")[0]
            const isToday = day.date.getTime() === today.getTime()

            return (
              <div
                key={dateStr}
                className={cn(
                  "calendar-day bg-white dark:bg-gray-800 h-24 sm:h-32 p-1 overflow-hidden relative transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                  isToday ? "border-2 border-blue-500" : "",
                )}
                onClick={() => {
                  // Pre-fill date in quick add modal
                  onAddTask()
                }}
              >
                <div
                  className={cn(
                    "text-right text-xs sm:text-sm",
                    isToday ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {day.date.getDate()}
                </div>

                <div className="task-list-calendar mt-1 space-y-1 overflow-y-auto max-h-[80px] sm:max-h-[100px] pr-1">
                  {day.tasks.map((task) => {
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
                          "text-xs p-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded truncate border-l-2",
                          borderColor,
                          task.completed ? "opacity-60 line-through" : "",
                        )}
                        title={task.title}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick(task.id)
                        }}
                      >
                        {task.title}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
