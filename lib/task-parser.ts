interface ParsedTask {
  title: string
  dueDate: string
  priority: string
  list: string
  tags: string[]
}

export function parseTaskInput(input: string): ParsedTask {
  let title = input
  let dueDate = ""
  let priority = "none"
  let list = "inbox" // Default list
  const tagsArr: string[] = []

  // Match due dates (very basic: tomorrow, next week, YYYY-MM-DD, MM/DD)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  if (/\btomorrow\b/i.test(title)) {
    dueDate = tomorrow.toISOString().split("T")[0]
    title = title.replace(/\btomorrow\b/i, "").trim()
  } else if (/\bnext week\b/i.test(title)) {
    dueDate = nextWeek.toISOString().split("T")[0]
    title = title.replace(/\bnext week\b/i, "").trim()
  } else {
    const dateMatch = title.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}(\/\d{2,4})?)/)
    if (dateMatch && dateMatch[0]) {
      try {
        dueDate = new Date(dateMatch[0]).toISOString().split("T")[0]
        title = title.replace(dateMatch[0], "").trim()
      } catch (e) {
        /* ignore invalid date parse */
      }
    }
  }

  // Match priorities: !high, !medium, !low, !none
  const priorityMatch = title.match(/!(\bhigh\b|\bmedium\b|\blow\b|\bnone\b)/i)
  if (priorityMatch && priorityMatch[1]) {
    priority = priorityMatch[1].toLowerCase()
    title = title.replace(priorityMatch[0], "").trim()
  }

  // Match lists: #listname
  const listMatch = title.match(/#(\w+)/)
  if (listMatch && listMatch[1]) {
    list = listMatch[1].toLowerCase()
    title = title.replace(listMatch[0], "").trim()
  }

  // Match tags: @tagname
  const tagMatches = title.match(/@(\w+)/g) // Find all tags
  if (tagMatches) {
    tagMatches.forEach((tagMatch) => {
      const tagName = tagMatch.substring(1).toLowerCase()
      tagsArr.push(tagName)
      title = title.replace(tagMatch, "").trim()
    })
  }

  return {
    title: title.replace(/ +/g, " ").trim(),
    dueDate,
    priority,
    list,
    tags: tagsArr,
  }
}
