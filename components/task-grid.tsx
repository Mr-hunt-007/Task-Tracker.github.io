"use client"

import { useState } from "react"
import { Calendar, Flag, Folder, Trash, CheckCircle } from "lucide-react"
import type { Task, List, Tag } from "@/types"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/date-utils"

interface TaskGridProps {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  tags: Tag[]
  lists: List[]
}

export function TaskGrid({ tasks, onToggleCompletion, onDeleteTask, tags, lists }: TaskGridProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)

  const getTagById = (tagId: string) => tags.find((tag) => tag.id === tagId)
  const getListById = (listId: string) => lists.find((list) => list.id === listId)

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "border-red-500"
      case "medium":
        return "border-yellow-500"
      case "low":
        return "border-blue-500"
      default:
        return "border-gray-300 dark:border-gray-600"
    }
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 italic p-4">No tasks found for this view/filter.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {tasks.map((task) => {
        const today = new Date().toISOString().split("T")[0]
        let dateClass = ""

        if (task.dueDate) {
          if (!task.completed && task.dueDate < today) {
            dateClass = "text-red-600 dark:text-red-400 font-semibold" // Overdue
          } else if (task.dueDate === today) {
            dateClass = "text-blue-600 dark:text-blue-400 font-semibold" // Due today
          }
        }

        return (
          <div
            key={task.id}
            className={cn(
              "task-card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-t-4 transition duration-150 ease-in-out relative flex flex-col h-full",
              getPriorityColor(task.priority),
              task.completed ? "opacity-60" : "",
              "hover:shadow-md transform hover:-translate-y-1 transition-all duration-200",
            )}
            onMouseEnter={() => setHoveredTaskId(task.id)}
            onMouseLeave={() => setHoveredTaskId(null)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3
                className={cn(
                  "font-medium text-lg break-words pr-6",
                  task.completed ? "line-through text-gray-500 dark:text-gray-400" : "",
                )}
              >
                {task.title}
              </h3>

              <div className="flex items-center space-x-1">
                <button
                  className={cn(
                    "task-check-button w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition",
                    task.completed
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400",
                  )}
                  onClick={() => onToggleCompletion(task.id)}
                  aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
                >
                  {task.completed && <CheckCircle className="h-4 w-4" />}
                </button>

                <button
                  className={cn(
                    "task-delete-button text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 rounded transition-opacity",
                    hoveredTaskId === task.id ? "opacity-100" : "opacity-0",
                  )}
                  onClick={() => onDeleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{task.description}</p>
            )}

            <div className="mt-auto">
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.length > 0 &&
                  task.tags.map((tagId) => {
                    const tag = getTagById(tagId)
                    if (!tag) return null

                    return (
                      <span
                        key={tagId}
                        className="tag-display text-xs px-2 py-0.5 rounded-full mr-1 whitespace-nowrap"
                        style={{
                          backgroundColor: `var(--${tag.color}-100)`,
                          color: `var(--${tag.color}-800)`,
                        }}
                      >
                        {tag.name}
                      </span>
                    )
                  })}
              </div>

              <div className="flex items-center flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-x-3 gap-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                {task.priority !== "none" && task.priority && (
                  <span className="flex items-center whitespace-nowrap">
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </span>
                )}

                {task.dueDate && (
                  <span className={cn("flex items-center whitespace-nowrap", dateClass)}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(task.dueDate)}
                  </span>
                )}

                {task.list && task.list !== "inbox" && (
                  <span className="flex items-center whitespace-nowrap">
                    <Folder className="w-3 h-3 mr-1" />
                    {getListById(task.list)?.name || task.list}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
