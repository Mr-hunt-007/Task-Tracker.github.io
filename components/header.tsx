"use client"

import { useState } from "react"
import { Search, List, LayoutGrid, Moon, Sun, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import type { Filter, List as ListType, SortOption } from "@/types"

interface HeaderProps {
  currentView: string
  taskCount: number
  currentFilter: Filter
  onFilterChange: (filter: Filter) => void
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  onVoiceInput: () => void
  notificationsOpen: boolean
  onToggleNotifications: () => void
  lists: ListType[]
}

export function Header({
  currentView,
  taskCount,
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
  onVoiceInput,
  notificationsOpen,
  onToggleNotifications,
  lists,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const getViewTitle = () => {
    if (currentView.startsWith("list-")) {
      const listId = currentView.split("-")[1]
      const list = lists.find((l) => l.id === listId)
      return list?.name || "List"
    } else if (currentView.startsWith("tag-")) {
      return `Tag: ${currentView.split("-")[1]}`
    } else {
      const titles: Record<string, string> = {
        inbox: "Inbox",
        today: "Today",
        upcoming: "Upcoming",
        kanban: "Kanban Board",
        timeline: "Timeline",
        calendar: "Calendar",
        pomodoro: "Pomodoro Timer",
        matrix: "Eisenhower Matrix",
      }
      return titles[currentView] || "Tasks"
    }
  }

  const getSortLabel = (sort: SortOption) => {
    const labels: Record<SortOption, string> = {
      dueDate: "Due Date",
      priority: "Priority",
      createdAt: "Date Added",
      title: "Alphabetical",
    }
    return labels[sort]
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{taskCount} tasks</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition text-sm"
              disabled
              title="Search not implemented"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              className={`view-toggle p-1 rounded-md ${currentView === "list" ? "bg-blue-500 text-white" : "text-gray-500 dark:text-gray-400"}`}
              title="List View (default)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className="view-toggle p-1 rounded-md text-gray-500 dark:text-gray-400 opacity-50 cursor-not-allowed"
              title="Grid View not implemented"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
          >
            <Moon className="w-5 h-5 dark:hidden" />
            <Sun className="w-5 h-5 hidden dark:inline" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={onToggleNotifications}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 relative focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-mono">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Button
            variant={currentFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={currentFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("active")}
          >
            Active
          </Button>
          <Button
            variant={currentFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("completed")}
          >
            Completed
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none"
            >
              <span>Sort by: {getSortLabel(currentSort)}</span>
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  {(["dueDate", "priority", "createdAt", "title"] as SortOption[]).map((sort) => (
                    <button
                      key={sort}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        currentSort === sort
                          ? "font-semibold text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        onSortChange(sort)
                        setSortDropdownOpen(false)
                      }}
                    >
                      {getSortLabel(sort)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
