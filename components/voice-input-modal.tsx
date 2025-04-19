"use client"

import { useState, useEffect } from "react"
import { Mic, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceInputModalProps {
  isOpen: boolean
  onClose: () => void
  onVoiceInput: (text: string) => void
}

export function VoiceInputModal({ isOpen, onClose, onVoiceInput }: VoiceInputModalProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.lang = "en-US"
        recognitionInstance.interimResults = true
        recognitionInstance.maxAlternatives = 1

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          if (finalTranscript) {
            setRecognizedText(finalTranscript)
            stopRecording()
          } else if (interimTranscript) {
            setRecognizedText(interimTranscript)
          }
        }

        recognitionInstance.onstart = () => {
          setIsRecording(true)
        }

        recognitionInstance.onend = () => {
          setIsRecording(false)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsRecording(false)
        }

        setRecognition(recognitionInstance)
      }
    }

    return () => {
      if (recognition) {
        recognition.onresult = null
        recognition.onstart = null
        recognition.onend = null
        recognition.onerror = null
      }
    }
  }, [])

  const startRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    setRecognizedText("")
    try {
      recognition.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
    }
  }

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop()
    }
  }

  const handleSubmit = () => {
    if (recognizedText) {
      onVoiceInput(recognizedText)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 text-center transform transition-transform duration-300 animate-in zoom-in-95">
        <div className="mb-4">
          <div className={cn("text-4xl text-blue-600 dark:text-blue-400 mb-2", isRecording && "animate-pulse")}>
            <Mic className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-1">Voice Input</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isRecording
              ? "Listening... Speak now!"
              : recognizedText
                ? "Click 'Use Text' to add this as a task"
                : "Click the 'Start' button and speak your task."}
          </p>
        </div>

        {recognizedText && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left animate-in fade-in slide-in-from-bottom-5 duration-300">
            <p className="text-sm">
              Recognized: "<em className="font-semibold">{recognizedText}</em>"
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
            >
              <Mic className="w-4 h-4 mr-1" /> Start
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
            >
              <StopCircle className="w-4 h-4 mr-1" /> Stop
            </Button>
          )}

          {recognizedText && (
            <Button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
            >
              Use Text
            </Button>
          )}

          <Button variant="outline" onClick={onClose} className="px-6 py-2 rounded-full transition">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
