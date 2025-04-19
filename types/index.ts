export type Task = {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low" | "none"
  list: string
  tags: string[]
  completed: boolean
  createdAt: string
  status: "todo" | "inProgress" | "done"
}

export type List = {
  id: string
  name: string
  icon: string
  color: string
}

export type Tag = {
  id: string
  name: string
  color: string
}

export type View = "inbox" | "today" | "upcoming" | "kanban" | "timeline" | "calendar" | "pomodoro" | "matrix" | string // For list-{id} and tag-{id} views

export type Filter = "all" | "active" | "completed"

export type SortOption = "dueDate" | "priority" | "createdAt" | "title"
