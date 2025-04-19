"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TaskList } from "@/components/task-list"
import { KanbanBoard } from "@/components/kanban-board"
import { TimelineView } from "@/components/timeline-view"
import { CalendarView } from "@/components/calendar-view"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { EisenhowerMatrix } from "@/components/eisenhower-matrix"
import { QuickAddModal } from "@/components/quick-add-modal"
import { VoiceInputModal } from "@/components/voice-input-modal"
import { ConfirmModal } from "@/components/confirm-modal"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import type { Task, List, Tag, View, Filter, SortOption } from "@/types"
import { generateMockData } from "@/lib/mock-data"

export default function TaskTracker() {
  // State
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [currentView, setCurrentView] = useState<View>("inbox")
  const [currentFilter, setCurrentFilter] = useState<Filter>("all")
  const [currentSort, setCurrentSort] = useState<SortOption>("dueDate")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [calendarDate, setCalendarDate] = useState(new Date())

  // UI State
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [voiceInputOpen, setVoiceInputOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmModalProps, setConfirmModalProps] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  })
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const { theme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Load data on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskTrackerTasks")
    const savedLists = localStorage.getItem("taskTrackerLists")
    const savedTags = localStorage.getItem("taskTrackerTags")
    const savedPomodoros = localStorage.getItem("pomodoroCompletedCount")
    const savedView = localStorage.getItem("taskTrackerCurrentView")

    try {
      if (savedTasks) setTasks(JSON.parse(savedTasks))
      if (savedLists) setLists(JSON.parse(savedLists))
      if (savedTags) setTags(JSON.parse(savedTags))
      if (savedPomodoros) setCompletedPomodoros(Number.parseInt(savedPomodoros, 10))
      if (savedView) setCurrentView(JSON.parse(savedView))
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      // Load mock data if localStorage fails
      const { mockTasks, mockLists, mockTags } = generateMockData()
      setTasks(mockTasks)
      setLists(mockLists)
      setTags(mockTags)
    }
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem("taskTrackerTasks", JSON.stringify(tasks))
    if (lists.length > 0) localStorage.setItem("taskTrackerLists", JSON.stringify(lists))
    if (tags.length > 0) localStorage.setItem("taskTrackerTags", JSON.stringify(tags))
    localStorage.setItem("pomodoroCompletedCount", completedPomodoros.toString())
    localStorage.setItem("taskTrackerCurrentView", JSON.stringify(currentView))
  }, [tasks, lists, tags, completedPomodoros, currentView])

  // Task operations
  const addTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...newTask,
    }
    setTasks((prev) => [task, ...prev])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            // Update kanban status based on completion
            status: completed ? "done" : task.status === "done" ? "todo" : task.status,
          }
        }
        return task
      }),
    )
  }

  // Handle drag end for kanban board
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const activeId = active.id.toString()
      const overId = over.id.toString()

      // If dragging between columns
      if (active.data.current?.type === "task" && over.data.current?.type === "column") {
        const newStatus = over.data.current.status
        updateTask(activeId, { status: newStatus })
        return
      }

      // If reordering within a column
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === activeId)
        const newIndex = tasks.findIndex((task) => task.id === overId)

        return arrayMove(tasks, oldIndex, newIndex)
      })
    }
  }

  // Modal handlers
  const openQuickAddModal = () => setQuickAddOpen(true)
  const closeQuickAddModal = () => setQuickAddOpen(false)

  const openVoiceInputModal = () => setVoiceInputOpen(true)
  const closeVoiceInputModal = () => setVoiceInputOpen(false)

  const openConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalProps({ title, message, onConfirm })
    setConfirmModalOpen(true)
  }
  const closeConfirmModal = () => setConfirmModalOpen(false)

  // Render the appropriate view
  const renderCurrentView = () => {
    // Filter tasks based on current view and filters
    const filteredTasks = tasks
      .filter((task) => {
        // View-specific filtering
        if (currentView === "today") {
          const today = new Date().toISOString().split("T")[0]
          return task.dueDate === today
        } else if (currentView === "upcoming") {
          const today = new Date()
          const futureDate = new Date()
          futureDate.setDate(today.getDate() + 7)

          if (!task.dueDate) return false

          const dueDate = new Date(task.dueDate)
          return dueDate >= today && dueDate <= futureDate
        } else if (currentView.startsWith("list-")) {
          const listId = currentView.split("-")[1]
          return task.list === listId
        } else if (currentView.startsWith("tag-")) {
          const tagId = currentView.split("-")[1]
          return task.tags.includes(tagId)
        } else if (currentView === "inbox") {
          return task.list === "inbox" || !task.list
        }

        // For other views, don't filter by view type
        return true
      })
      .filter((task) => {
        // Filter by completion status
        if (currentView !== "kanban" && currentView !== "matrix") {
          if (currentFilter === "active") return !task.completed
          if (currentFilter === "completed") return task.completed
        }
        return true
      })

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      const getPriorityValue = (priority: string | undefined) => {
        switch (priority) {
          case "high":
            return 3
          case "medium":
            return 2
          case "low":
            return 1
          default:
            return 0
        }
      }

      switch (currentSort) {
        case "dueDate":
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31")
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31")
          return dateA.getTime() - dateB.getTime()
        case "priority":
          return getPriorityValue(b.priority) - getPriorityValue(a.priority)
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    // Render the appropriate view component
    switch (currentView) {
      case "kanban":
        return (
          <DndContext
            sensors={[]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <KanbanBoard
              tasks={tasks}
              onAddTask={openQuickAddModal}
              onUpdateTask={updateTask}
              onDeleteTask={(taskId) => {
                const task = tasks.find((t) => t.id === taskId)
                openConfirmModal(
                  "Delete Task",
                  `Are you sure you want to delete "${task?.title || "this task"}"?`,
                  () => deleteTask(taskId),
                )
              }}
              onToggleCompletion={toggleTaskCompletion}
            />
          </DndContext>
        )
      case "timeline":
        return <TimelineView tasks={sortedTasks} onTaskClick={toggleTaskCompletion} />
      case "calendar":
        return (
          <CalendarView
            tasks={tasks}
            currentDate={calendarDate}
            onDateChange={setCalendarDate}
            onTaskClick={toggleTaskCompletion}
            onAddTask={openQuickAddModal}
          />
        )
      case "pomodoro":
        return (
          <PomodoroTimer
            completedPomodoros={completedPomodoros}
            onPomodoroComplete={() => setCompletedPomodoros((prev) => prev + 1)}
          />
        )
      case "matrix":
        return <EisenhowerMatrix tasks={tasks.filter((t) => !t.completed)} onTaskClick={toggleTaskCompletion} />
      case "today":
      case "upcoming":
        return (
          <TaskList
            tasks={sortedTasks}
            groupByDate={true}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={(taskId) => {
              const task = tasks.find((t) => t.id === taskId)
              openConfirmModal("Delete Task", `Are you sure you want to delete "${task?.title || "this task"}"?`, () =>
                deleteTask(taskId),
              )
            }}
            tags={tags}
            lists={lists}
          />
        )
      default:
        return (
          <TaskList
            tasks={sortedTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={(taskId) => {
              const task = tasks.find((t) => t.id === taskId)
              openConfirmModal("Delete Task", `Are you sure you want to delete "${task?.title || "this task"}"?`, () =>
                deleteTask(taskId),
              )
            }}
            tags={tags}
            lists={lists}
          />
        )
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        lists={lists}
        tags={tags}
        onQuickAdd={openQuickAddModal}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentView={currentView}
          taskCount={
            tasks.filter((t) => {
              if (currentView === "today") {
                const today = new Date().toISOString().split("T")[0]
                return t.dueDate === today
              } else if (currentView === "upcoming") {
                const today = new Date()
                const futureDate = new Date()
                futureDate.setDate(today.getDate() + 7)

                if (!t.dueDate) return false

                const dueDate = new Date(t.dueDate)
                return dueDate >= today && dueDate <= futureDate
              } else if (currentView.startsWith("list-")) {
                const listId = currentView.split("-")[1]
                return t.list === listId
              } else if (currentView.startsWith("tag-")) {
                const tagId = currentView.split("-")[1]
                return t.tags.includes(tagId)
              } else if (currentView === "inbox") {
                return t.list === "inbox" || !t.list
              }
              return true
            }).length
          }
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          onVoiceInput={openVoiceInputModal}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          lists={lists}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950/50">{renderCurrentView()}</main>
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={closeQuickAddModal}
        onAddTask={addTask}
        lists={lists}
        tags={tags}
        currentView={currentView}
      />

      <VoiceInputModal
        isOpen={voiceInputOpen}
        onClose={closeVoiceInputModal}
        onVoiceInput={(text) => {
          closeVoiceInputModal()
          setQuickAddOpen(true)
          // Pass voice text to quick add modal
          // This would be handled via a ref or context in a real implementation
        }}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={closeConfirmModal}
        title={confirmModalProps.title}
        message={confirmModalProps.message}
        onConfirm={() => {
          confirmModalProps.onConfirm()
          closeConfirmModal()
        }}
      />

      {notificationsOpen && <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />}
    </div>
  )
}
