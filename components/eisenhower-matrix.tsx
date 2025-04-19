"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Task } from "@/types"
import { Flag, Calendar } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface EisenhowerMatrixProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

export function EisenhowerMatrix({ tasks, onTaskClick }: EisenhowerMatrixProps) {
  const [quadrants, setQuadrants] = useState({
    urgentImportant: [] as Task[],
    notUrgentImportant: [] as Task[],
    urgentNotImportant: [] as Task[],
    notUrgentNotImportant: [] as Task[],
  })

  useEffect(() => {
    const today = new Date()
    const nearFuture = new Date(today)
    nearFuture.setDate(today.getDate() + 3) // Due within 3 days is "urgent"

    const categorizedTasks = {
      urgentImportant: [] as Task[],
      notUrgentImportant: [] as Task[],
      urgentNotImportant: [] as Task[],
      notUrgentNotImportant: [] as Task[],
    }

    tasks.forEach((task) => {
      // Determine Importance: High/Medium priority OR 'important' tag
      const isImportant = task.priority === "high" || task.priority === "medium" || task.tags.includes("important")

      // Determine Urgency: Due soon OR 'urgent' tag
      const isUrgent = task.tags.includes("urgent") || (task.dueDate && new Date(task.dueDate) <= nearFuture)

      if (isUrgent && isImportant) {
        categorizedTasks.urgentImportant.push(task)
      } else if (!isUrgent && isImportant) {
        categorizedTasks.notUrgentImportant.push(task)
      } else if (isUrgent && !isImportant) {
        categorizedTasks.urgentNotImportant.push(task)
      } else {
        categorizedTasks.notUrgentNotImportant.push(task)
      }
    })

    setQuadrants(categorizedTasks)
  }, [tasks])

  const renderQuadrant = (
    title: string,
    icon: React.ReactNode,
    tasks: Task[],
    bgColor: string,
    textColor: string,
    countBgColor: string,
  ) => {
    return (
      <div className={cn("rounded-lg p-4 border min-h-[200px]", bgColor)}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={cn("font-medium flex items-center", textColor)}>
            {icon}
            <span className="ml-1">{title}</span>
          </h4>
          <span className={cn("text-xs px-2 py-1 rounded-full", countBgColor, textColor)}>{tasks.length} tasks</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="matrix-item bg-white dark:bg-gray-700 rounded p-2 text-sm shadow-xs mb-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                onClick={() => onTaskClick(task.id)}
              >
                <div className="flex items-start justify-between">
                  <span className="font-medium truncate pr-2">{task.title}</span>
                  {task.priority && task.priority !== "none" && (
                    <Flag
                      className={cn(
                        "w-3 h-3 flex-shrink-0",
                        task.priority === "high"
                          ? "text-red-500"
                          : task.priority === "medium"
                            ? "text-yellow-500"
                            : "text-blue-500",
                      )}
                    />
                  )}
                </div>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(task.dueDate)}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic p-2">No tasks in this quadrant</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Eisenhower Matrix</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Prioritize tasks by Urgency & Importance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Urgent & Important */}
        {renderQuadrant(
          "Urgent & Important (Do)",
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>,
          quadrants.urgentImportant,
          "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700",
          "text-red-800 dark:text-red-200",
          "bg-red-200 dark:bg-red-800",
        )}

        {/* Quadrant 2: Not Urgent & Important */}
        {renderQuadrant(
          "Not Urgent & Important (Schedule)",
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>,
          quadrants.notUrgentImportant,
          "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
          "text-blue-800 dark:text-blue-200",
          "bg-blue-200 dark:bg-blue-800",
        )}

        {/* Quadrant 3: Urgent & Not Important */}
        {renderQuadrant(
          "Urgent & Not Important (Delegate)",
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>,
          quadrants.urgentNotImportant,
          "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700",
          "text-yellow-800 dark:text-yellow-200",
          "bg-yellow-200 dark:bg-yellow-800",
        )}

        {/* Quadrant 4: Not Urgent & Not Important */}
        {renderQuadrant(
          "Not Urgent & Not Important (Eliminate)",
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>,
          quadrants.notUrgentNotImportant,
          "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700",
          "text-green-800 dark:text-green-200",
          "bg-green-200 dark:bg-green-800",
        )}
      </div>
    </div>
  )
}
