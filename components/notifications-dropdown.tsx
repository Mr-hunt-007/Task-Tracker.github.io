"use client"

import { CalendarCheck, CheckCircle, AlertCircle } from "lucide-react"

interface NotificationsDropdownProps {
  onClose: () => void
}

export function NotificationsDropdown({ onClose }: NotificationsDropdownProps) {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "due",
      title: '"Complete project proposal" is due in 1 hour',
      time: "Today at 2:00 PM",
      icon: <CalendarCheck className="w-4 h-4" />,
      color: "blue",
    },
    {
      id: 2,
      type: "completed",
      title: '"Buy groceries" was completed',
      time: "30 minutes ago",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "green",
    },
    {
      id: 3,
      type: "overdue",
      title: '"Call mom" is overdue',
      time: "Yesterday at 5:00 PM",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "yellow",
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
      case "green":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300"
      case "red":
        return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
    }
  }

  return (
    <div className="absolute right-4 top-14 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 animate-in slide-in-from-top-5 fade-in duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline opacity-50 cursor-not-allowed">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-start">
              <div
                className={`rounded-full p-2 mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center ${getColorClasses(notification.color)}`}
              >
                {notification.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
        <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all notifications
        </a>
      </div>
    </div>
  )
}
