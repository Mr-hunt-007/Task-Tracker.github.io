export function formatDate(dateString: string, format: "long" | "short" | "weekday" = "long"): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString + "T00:00:00") // Interpret as local date
    if (isNaN(date.getTime())) return "" // Invalid date

    if (format === "short") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (format === "weekday") {
      return date.toLocaleDateString("en-US", { weekday: "long" })
    } else {
      // Default 'long' format
      // Check if it's today, tomorrow, yesterday
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      if (date.getTime() === today.getTime()) return "Today"
      if (date.getTime() === tomorrow.getTime()) return "Tomorrow"
      if (date.getTime() === yesterday.getTime()) return "Yesterday"

      // Otherwise, show standard format
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  } catch (e) {
    console.error("Error formatting date:", dateString, e)
    return ""
  }
}
