"use client"

import { useState, useEffect } from "react"

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query)
      setMatches(mediaQuery.matches)

      const listener = () => setMatches(mediaQuery.matches)
      window.addEventListener("resize", listener)

      return () => window.removeEventListener("resize", listener)
    }
  }, [query])

  return matches
}
