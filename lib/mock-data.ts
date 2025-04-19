import type { Task, List, Tag } from "@/types"

export function generateMockData() {
  const mockLists: List[] = [
    { id: "inbox", name: "Inbox", icon: "inbox", color: "blue" },
    { id: "work", name: "Work", icon: "briefcase", color: "green" },
    { id: "personal", name: "Personal", icon: "user", color: "purple" },
    { id: "shopping", name: "Shopping", icon: "shopping-cart", color: "orange" },
  ]

  const mockTags: Tag[] = [
    { id: "important", name: "Important", color: "red" },
    { id: "meeting", name: "Meeting", color: "blue" },
    { id: "project", name: "Project", color: "green" },
    { id: "urgent", name: "Urgent", color: "red" },
    { id: "someday", name: "Someday", color: "gray" },
  ]

  // Create dates relative to today
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split("T")[0]

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split("T")[0]

  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the proposal document and send to client",
      dueDate: todayStr,
      priority: "high",
      list: "work",
      tags: ["project", "urgent"],
      completed: false,
      createdAt: "2024-07-20T09:00:00",
      status: "inProgress",
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruits",
      dueDate: tomorrowStr,
      priority: "medium",
      list: "shopping",
      tags: [],
      completed: true,
      createdAt: "2024-07-22T18:30:00",
      status: "done",
    },
    {
      id: "3",
      title: "Call mom",
      description: "Discuss family reunion plans",
      dueDate: dayAfterTomorrowStr,
      priority: "low",
      list: "personal",
      tags: ["important"],
      completed: false,
      createdAt: "2024-07-21T14:15:00",
      status: "todo",
    },
    {
      id: "4",
      title: "Prepare for team meeting",
      description: "Gather all reports and prepare presentation",
      dueDate: tomorrowStr,
      priority: "high",
      list: "work",
      tags: ["meeting", "important"],
      completed: false,
      createdAt: "2024-07-20T11:20:00",
      status: "todo",
    },
    {
      id: "5",
      title: "Morning run",
      description: "5km around the park",
      dueDate: nextWeekStr,
      priority: "none",
      list: "personal",
      tags: [],
      completed: false,
      createdAt: "2024-07-19T07:00:00",
      status: "todo",
    },
    {
      id: "6",
      title: "Schedule dentist appointment",
      description: "",
      dueDate: nextWeekStr,
      priority: "medium",
      list: "personal",
      tags: ["important"],
      completed: false,
      createdAt: "2024-07-23T10:00:00",
      status: "todo",
    },
    {
      id: "7",
      title: "Respond to non-urgent emails",
      description: "",
      dueDate: "",
      priority: "low",
      list: "work",
      tags: [],
      completed: false,
      createdAt: "2024-07-23T11:00:00",
      status: "todo",
    },
  ]

  return { mockTasks, mockLists, mockTags }
}
