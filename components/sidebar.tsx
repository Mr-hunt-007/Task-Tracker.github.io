"use client"

import { useState } from "react"
import {
  CheckCircle,
  Inbox,
  CalendarDays,
  CalendarClock,
  Columns,
  BarChart,
  Calendar,
  Timer,
  LayoutGrid,
  Plus,
  Settings,
  Briefcase,
  User,
  ShoppingCart,
} from "lucide-react"
import type { List, Tag, View } from "@/types"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: string
  onViewChange: (view: View) => void
  lists: List[]
  tags: Tag[]
  onQuickAdd: () => void
}

export function Sidebar({ currentView, onViewChange, lists, tags, onQuickAdd }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const mainNavItems = [
    { id: "inbox", label: "Inbox", icon: <Inbox className="w-5 h-5" /> },
    { id: "today", label: "Today", icon: <CalendarDays className="w-5 h-5" /> },
    { id: "upcoming", label: "Upcoming", icon: <CalendarClock className="w-5 h-5" /> },
    { id: "kanban", label: "Kanban", icon: <Columns className="w-5 h-5" /> },
    { id: "timeline", label: "Timeline", icon: <BarChart className="w-5 h-5" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-5 h-5" /> },
    { id: "pomodoro", label: "Pomodoro", icon: <Timer className="w-5 h-5" /> },
    { id: "matrix", label: "Eisenhower", icon: <LayoutGrid className="w-5 h-5" /> },
  ]

  const getListIcon = (list: List) => {
    switch (list.icon) {
      case "briefcase":
        return <Briefcase className="w-5 h-5" style={{ color: getColorValue(list.color, 500) }} />
      case "user":
        return <User className="w-5 h-5" style={{ color: getColorValue(list.color, 500) }} />
      case "shopping-cart":
        return <ShoppingCart className="w-5 h-5" style={{ color: getColorValue(list.color, 500) }} />
      default:
        return <Inbox className="w-5 h-5" style={{ color: getColorValue(list.color, 500) }} />
    }
  }

  const getColorValue = (color: string, shade: number) => {
    const colors: Record<string, Record<number, string>> = {
      red: { 500: "#ef4444", 800: "#991b1b", 100: "#fee2e2" },
      blue: { 500: "#3b82f6", 800: "#1e40af", 100: "#dbeafe" },
      green: { 500: "#22c55e", 800: "#166534", 100: "#dcfce7" },
      purple: { 500: "#a855f7", 800: "#6b21a8", 100: "#f3e8ff" },
      orange: { 500: "#f97316", 800: "#9a3412", 100: "#ffedd5" },
      yellow: { 500: "#f59e0b", 800: "#92400e", 100: "#fef3c7" },
      gray: { 500: "#6b7280", 800: "#1f2937", 100: "#f3f4f6" },
    }

    return colors[color]?.[shade] || colors.gray[shade]
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 shadow-md flex flex-col flex-shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1
          className={cn(
            "font-bold text-blue-600 dark:text-blue-400 flex items-center",
            collapsed ? "text-xl" : "text-2xl",
          )}
        >
          <CheckCircle className="mr-2" />
          {!collapsed && "TaskTracker"}
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick Add */}
        <div className="p-4">
          <button
            onClick={onQuickAdd}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            {!collapsed && "Quick Add"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "nav-item flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors",
                  currentView === item.id
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
                onClick={() => onViewChange(item.id as View)}
              >
                <span className="flex-shrink-0 w-5 h-5 mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Lists */}
          {!collapsed && (
            <div className="mt-8">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>Lists</span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-50 cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {lists
                  .filter((list) => list.id !== "inbox")
                  .map((list) => (
                    <button
                      key={list.id}
                      className={cn(
                        "nav-item flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors",
                        currentView === `list-${list.id}`
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      )}
                      onClick={() => onViewChange(`list-${list.id}` as View)}
                    >
                      <span className="flex-shrink-0 w-5 h-5 mr-3">{getListIcon(list)}</span>
                      <span>{list.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {!collapsed && (
            <div className="mt-8">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>Tags</span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-50 cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    className={cn(
                      "nav-item flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors",
                      currentView === `tag-${tag.id}`
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                    )}
                    onClick={() => onViewChange(`tag-${tag.id}` as View)}
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-3 inline-block flex-shrink-0"
                      style={{ backgroundColor: getColorValue(tag.color, 500) }}
                    />
                    <span>{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* User & Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            {!collapsed && <span className="ml-2 text-sm font-medium">User</span>}
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
