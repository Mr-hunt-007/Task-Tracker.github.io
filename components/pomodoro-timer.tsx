"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PomodoroTimerProps {
  completedPomodoros: number
  onPomodoroComplete: () => void
}

type PomodoroMode = "focus" | "shortBreak" | "longBreak"

export function PomodoroTimer({ completedPomodoros, onPomodoroComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<PomodoroMode>("focus")
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3")

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const selectMode = (newMode: PomodoroMode) => {
    if (isRunning && mode === newMode) return

    stopTimer(false)
    setMode(newMode)

    const durations: Record<PomodoroMode, number> = {
      focus: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    }

    setTotalSeconds(durations[newMode])
    setSecondsLeft(durations[newMode])
  }

  const startTimer = () => {
    if (isRunning) return

    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopTimer(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = (completed: boolean) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRunning(false)

    if (completed) {
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.warn("Audio playback failed", e))
      }

      // If focus mode completed, increment counter
      if (mode === "focus") {
        onPomodoroComplete()
      }
    }
  }

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer(false)
    } else {
      startTimer()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusText = () => {
    if (isRunning) {
      return `${mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"} - Running`
    } else if (secondsLeft === 0) {
      return `${mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"} session finished!`
    } else {
      return `Ready to ${mode === "focus" ? "focus" : "take a break"}`
    }
  }

  // Calculate progress for the circle
  const progress = (totalSeconds - secondsLeft) / totalSeconds
  const circumference = 2 * Math.PI * 45 // 2 * pi * r (where r=45 from svg)
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Stay focused and take breaks!</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              className="text-blue-500 dark:text-blue-400"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-4xl font-bold">{formatTime(secondsLeft)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getStatusText()}</div>
            <Button
              onClick={toggleTimer}
              className={cn(
                "mt-3 px-4 py-1 rounded-full text-sm transition",
                isRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white",
              )}
            >
              {isRunning ? "Pause" : "Start"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <Button
          variant={mode === "focus" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => selectMode("focus")}
        >
          Focus (25m)
        </Button>
        <Button
          variant={mode === "shortBreak" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => selectMode("shortBreak")}
        >
          Short Break (5m)
        </Button>
        <Button
          variant={mode === "longBreak" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => selectMode("longBreak")}
        >
          Long Break (15m)
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pomodoros completed: <span className="font-semibold">{completedPomodoros}</span>
        </p>
      </div>
    </div>
  )
}
