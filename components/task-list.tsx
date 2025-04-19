"use client"

import { useState } from "react"
import { Calendar, Flag, Folder, Trash } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task, List, Tag } from "@/types"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/date-utils"

interface TaskListProps {
  tasks: Task[]
  groupByDate?: boolean
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  tags: Tag[]
  lists: List[]
}

export function TaskList({ tasks, groupByDate = false, onToggleCompletion, onDeleteTask, tags, lists }: TaskListProps) {
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

  const SortableTaskItem = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10 : 1,
    }

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
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "task-item bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 pr-8 border-l-4 transition duration-150 ease-in-out relative flex items-start group cursor-grab active:cursor-grabbing",
          getPriorityColor(task.priority),
          task.completed ? "opacity-60" : "",
        )}
        onMouseEnter={() => setHoveredTaskId(task.id)}
        onMouseLeave={() => setHoveredTaskId(null)}
      >
        <div className="flex items-center pt-1 mr-3">
          <button
            className={cn(
              "task-check-button w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition",
              task.completed
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompletion(task.id)
            }}
            aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
          >
            {task.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-start mb-1">
            <span
              className={cn(
                "font-medium pr-2 break-words",
                task.completed ? "line-through text-gray-500 dark:text-gray-400" : "",
              )}
            >
              {task.title}
            </span>

            <button
              className={cn(
                "task-delete-button absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 rounded transition-opacity",
                hoveredTaskId === task.id ? "opacity-100" : "opacity-0",
              )}
              onClick={(e) => {
                e.stopPropagation()
                onDeleteTask(task.id)
              }}
              aria-label="Delete task"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2 truncate">{task.description}</p>
          )}

          <div className="flex items-center flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1 gap-x-3 gap-y-1">
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

            {task.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1">
                {task.tags.map((tagId) => {
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
            )}
          </div>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 italic p-4">No tasks found for this view/filter.</p>
    )
  }

  if (!groupByDate) {
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <SortableTaskItem key={task.id} task={task} />
        ))}
      </div>
    )
  }

  // Group tasks by date for Today/Upcoming views
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const groups = {
    overdue: { title: "Overdue", tasks: [] as Task[] },
    today: { title: "Today", tasks: [] as Task[] },
    tomorrow: { title: "Tomorrow", tasks: [] as Task[] },
    thisWeek: { title: "This Week", tasks: [] as Task[] },
    later: { title: "Later", tasks: [] as Task[] },
    noDate: { title: "No Date", tasks: [] as Task[] },
  }

  tasks.forEach((task) => {
    if (!task.dueDate) {
      groups.noDate.tasks.push(task)
    } else if (task.dueDate < today && !task.completed) {
      groups.overdue.tasks.push(task)
    } else if (task.dueDate === today) {
      groups.today.tasks.push(task)
    } else if (task.dueDate === tomorrowStr) {
      groups.tomorrow.tasks.push(task)
    } else {
      const dueDate = new Date(task.dueDate)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      if (dueDate <= nextWeek) {
        groups.thisWeek.tasks.push(task)
      } else {
        groups.later.tasks.push(task)
      }
    }
  })

  // Define display order based on view
  const displayOrder = ["overdue", "today", "tomorrow", "thisWeek", "later", "noDate"]

  return (
    <div className="space-y-6">
      {displayOrder.map((key) => {
        const group = groups[key as keyof typeof groups]
        if (group.tasks.length === 0) return null

        return (
          <div key={key} className="mb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between mb-2 sticky top-0 bg-gray-50 dark:bg-gray-950/50 py-2 z-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                {group.title}
                {key === "today" && (
                  <span className="text-sm font-normal text-gray-500 ml-2">({formatDate(today, "short")})</span>
                )}
                {key === "tomorrow" && (
                  <span className="text-sm font-normal text-gray-500 ml-2">({formatDate(tomorrowStr, "short")})</span>
                )}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">{group.tasks.length} tasks</span>
            </div>
            <div className="space-y-3">
              {group.tasks.map((task) => (
                <SortableTaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
