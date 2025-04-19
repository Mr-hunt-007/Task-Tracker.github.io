import type { Task, List, Tag } from "@/types"

export function generateMockData() {
  const mockLists: List[] = [
    { id: "inbox", name: "Inbox", icon: "inbox", color: "blue" },
    { id: "work", name: "Work", icon: "briefcase", color: "green" },
    { id: "personal", name: "Personal", icon: "user", color: "purple" },
    { id: "shopping", name: "Shopping", icon: "shopping-cart", color: "orange" },
    { id: "health", name: "Health", icon: "heart", color: "red" },
    { id: "education", name: "Education", icon: "book", color: "yellow" },
  ]

  const mockTags: Tag[] = [
    { id: "important", name: "Important", color: "red" },
    { id: "meeting", name: "Meeting", color: "blue" },
    { id: "project", name: "Project", color: "green" },
    { id: "urgent", name: "Urgent", color: "red" },
    { id: "someday", name: "Someday", color: "gray" },
    { id: "quick", name: "Quick", color: "yellow" },
    { id: "creative", name: "Creative", color: "purple" },
    { id: "research", name: "Research", color: "blue" },
  ]

  // Create dates relative to today
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

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
      description: "Finish the proposal document and send to client for review. Include budget estimates and timeline.",
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
      description: "Milk, eggs, bread, fruits, vegetables, and snacks for the week",
      dueDate: tomorrowStr,
      priority: "medium",
      list: "shopping",
      tags: ["quick"],
      completed: false,
      createdAt: "2024-07-22T18:30:00",
      status: "todo",
    },
    {
      id: "3",
      title: "Call mom",
      description: "Discuss family reunion plans and birthday gift ideas",
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
      description: "Gather all reports and prepare presentation slides for quarterly review",
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
      description: "5km around the park - bring water and wireless earbuds",
      dueDate: todayStr,
      priority: "medium",
      list: "health",
      tags: [],
      completed: true,
      createdAt: "2024-07-19T07:00:00",
      status: "done",
    },
    {
      id: "6",
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith's office for a cleaning and check-up",
      dueDate: nextWeekStr,
      priority: "medium",
      list: "health",
      tags: ["important"],
      completed: false,
      createdAt: "2024-07-23T10:00:00",
      status: "todo",
    },
    {
      id: "7",
      title: "Respond to non-urgent emails",
      description: "Clear inbox and organize messages into folders",
      dueDate: "",
      priority: "low",
      list: "work",
      tags: [],
      completed: false,
      createdAt: "2024-07-23T11:00:00",
      status: "todo",
    },
    {
      id: "8",
      title: "Research new programming framework",
      description: "Evaluate pros and cons for the upcoming project",
      dueDate: nextWeekStr,
      priority: "medium",
      list: "education",
      tags: ["research", "project"],
      completed: false,
      createdAt: "2024-07-22T15:30:00",
      status: "todo",
    },
    {
      id: "9",
      title: "Pay utility bills",
      description: "Electricity, water, and internet bills due this month",
      dueDate: yesterdayStr,
      priority: "high",
      list: "personal",
      tags: ["urgent"],
      completed: false,
      createdAt: "2024-07-18T09:45:00",
      status: "todo",
    },
    {
      id: "10",
      title: "Plan weekend getaway",
      description: "Research destinations, accommodations, and activities",
      dueDate: dayAfterTomorrowStr,
      priority: "low",
      list: "personal",
      tags: ["creative", "someday"],
      completed: false,
      createdAt: "2024-07-21T20:15:00",
      status: "todo",
    },
    {
      id: "11",
      title: "Order new office supplies",
      description: "Notebooks, pens, sticky notes, and printer paper",
      dueDate: tomorrowStr,
      priority: "low",
      list: "work",
      tags: ["quick"],
      completed: false,
      createdAt: "2024-07-23T14:20:00",
      status: "todo",
    },
    {
      id: "12",
      title: "Update resume",
      description: "Add recent projects and skills",
      dueDate: "",
      priority: "medium",
      list: "personal",
      tags: ["someday"],
      completed: false,
      createdAt: "2024-07-19T16:40:00",
      status: "todo",
    },
  ]

  return { mockTasks, mockLists, mockTags }
}
