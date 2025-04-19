"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task } from "@/types"
import { Plus, Check, Calendar, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/date-utils"

interface KanbanBoardProps {
  tasks: Task[]
  onAddTask: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onToggleCompletion: (taskId: string) => void
}

export function KanbanBoard({ tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleCompletion }: KanbanBoardProps) {
  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => {
      if (status === "done") {
        return task.status === "done" || task.completed
      }
      return task.status === status && !task.completed
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          tasks={getTasksByStatus(column.id)}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </div>
  )
}

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onToggleCompletion: (taskId: string) => void
}

function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleCompletion,
}: KanbanColumnProps) {
  return (
    <div className="kanban-column bg-gray-100 dark:bg-gray-800 rounded-lg p-4" data-type="column" data-status={id}>
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-100 dark:bg-gray-800 py-2 z-5">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
          {tasks.length} tasks
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onToggleCompletion={onToggleCompletion}
              />
            ))
          ) : (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic p-2">
              {id === "todo"
                ? "Drag tasks here or click 'Add task'"
                : id === "inProgress"
                  ? "Drag tasks here"
                  : "Completed tasks appear here"}
            </p>
          )}
        </div>
      </SortableContext>

      <button
        className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition"
        onClick={onAddTask}
      >
        <Plus className="w-4 h-4 mr-1" /> Add task
      </button>
    </div>
  )
}

interface KanbanCardProps {
  task: Task
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onToggleCompletion: (taskId: string) => void
}

function KanbanCard({ task, onUpdateTask, onDeleteTask, onToggleCompletion }: KanbanCardProps) {
  const [showDelete, setShowDelete] = useState(false)

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
  }

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "kanban-card bg-white dark:bg-gray-700 rounded-lg shadow p-3 cursor-move border-l-4 transition transform hover:shadow-md hover:-translate-y-1",
        getPriorityColor(task.priority),
        task.completed ? "opacity-70" : "opacity-100",
      )}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className={cn("text-sm font-medium", task.completed ? "line-through" : "")}>{task.title}</h3>

        {showDelete && (
          <button
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteTask(task.id)
            }}
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {task.description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">{task.description}</p>}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        {task.dueDate ? (
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(task.dueDate)}
          </span>
        ) : (
          <span>&nbsp;</span>
        )}

        <div className="flex items-center space-x-2">
          {task.priority && task.priority !== "none" && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                task.priority === "high"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                  : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
              )}
            >
              {task.priority}
            </span>
          )}

          <button
            className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center",
              task.completed
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 dark:border-gray-500 hover:border-blue-400",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompletion(task.id)
            }}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  )
}
