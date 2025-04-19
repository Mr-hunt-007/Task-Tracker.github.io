"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Calendar, Flag, Folder, TagIcon, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, List, Tag } from "@/types"
import { parseTaskInput } from "@/lib/task-parser"

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
  lists: List[]
  tags: Tag[]
  currentView: string
}

export function QuickAddModal({ isOpen, onClose, onAddTask, lists, tags, currentView }: QuickAddModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<string>("none")
  const [list, setList] = useState("inbox")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setDueDate("")
      setPriority("none")

      // Pre-select list based on current view
      if (currentView.startsWith("list-")) {
        setList(currentView.split("-")[1])
      } else {
        setList("inbox")
      }

      setSelectedTags([])
      setShowDetails(false)
    }
  }, [isOpen, currentView])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Task title cannot be empty")
      return
    }

    // Parse natural language from title if details aren't shown
    let finalTitle = title
    let finalDueDate = dueDate
    let finalPriority = priority
    let finalList = list
    let finalTags = [...selectedTags]

    if (!showDetails) {
      const parsed = parseTaskInput(title)
      finalTitle = parsed.title

      if (!dueDate && parsed.dueDate) {
        finalDueDate = parsed.dueDate
      }

      if (priority === "none" && parsed.priority) {
        finalPriority = parsed.priority
      }

      if (list === "inbox" && parsed.list) {
        finalList = parsed.list
      }

      if (parsed.tags.length > 0) {
        finalTags = [...new Set([...selectedTags, ...parsed.tags])]
      }
    }

    const newTask: Omit<Task, "id" | "createdAt"> = {
      title: finalTitle,
      description,
      dueDate: finalDueDate,
      priority: finalPriority as "high" | "medium" | "low" | "none",
      list: finalList,
      tags: finalTags,
      completed: false,
      status: "todo",
    }

    onAddTask(newTask)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 animate-in zoom-in-95">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Add Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="mb-4">
              <Input
                type="text"
                id="taskInput"
                placeholder="e.g., Buy milk tomorrow at 5pm #shopping !high"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Try using natural language: due dates, #list, @tag, !priority (high/medium/low)
              </p>
            </div>

            <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 flex-wrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-1" /> Date
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center"
                >
                  <Flag className="w-4 h-4 mr-1" /> Priority
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center"
                >
                  <Folder className="w-4 h-4 mr-1" /> List
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center"
                >
                  <TagIcon className="w-4 h-4 mr-1" /> Tag
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                title="Add via Voice"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>

            {showDetails && (
              <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-in slide-in-from-top duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label
                      htmlFor="modalDueDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Due Date
                    </label>
                    <Input type="date" id="modalDueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div>
                    <label
                      htmlFor="modalPriority"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Priority
                    </label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="modalList"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    List
                  </label>
                  <Select value={list} onValueChange={setList}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select list" />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((listItem) => (
                        <SelectItem key={listItem.id} value={listItem.id}>
                          {listItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="modalTags"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Tags
                  </label>
                  <Select
                    value={selectedTags.length > 0 ? selectedTags[0] : undefined}
                    onValueChange={(value) => {
                      if (!selectedTags.includes(value)) {
                        setSelectedTags([...selectedTags, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId)
                        if (!tag) return null

                        return (
                          <div
                            key={tagId}
                            className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-1 text-xs"
                          >
                            {tag.name}
                            <button
                              type="button"
                              className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              onClick={() => setSelectedTags(selectedTags.filter((id) => id !== tagId))}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="modalNotes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Notes
                  </label>
                  <Textarea
                    id="modalNotes"
                    rows={2}
                    placeholder="Add details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
