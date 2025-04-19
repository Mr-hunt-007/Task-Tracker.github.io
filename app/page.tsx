import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, LayoutGrid, Clock, List, Moon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold">TaskTracker</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/dashboard">Try for free</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Organize Your Tasks, Boost Your Productivity
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-10">
          TaskTracker helps you manage your tasks with multiple views, drag-and-drop organization, and powerful
          productivity tools.
        </p>
        <Button size="lg" asChild className="px-8 py-6 text-lg rounded-full">
          <Link href="/dashboard" className="flex items-center">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Powerful Features for Maximum Productivity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<List className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
            title="Multiple Views"
            description="Organize your tasks in list, kanban, timeline, or calendar views to suit your workflow."
          />
          <FeatureCard
            icon={<LayoutGrid className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
            title="Drag & Drop"
            description="Easily reorganize your tasks with smooth drag-and-drop functionality."
          />
          <FeatureCard
            icon={<Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
            title="Pomodoro Timer"
            description="Stay focused with built-in pomodoro timer to boost your productivity."
          />
          <FeatureCard
            icon={<Moon className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
            title="Dark Mode"
            description="Work comfortably day or night with light and dark mode options."
          />
        </div>
      </section>

      {/* App Preview */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-6">See TaskTracker in Action</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Experience the power of multiple views, drag-and-drop organization, and more.
        </p>
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
          <img src="https://raw.githubusercontent.com/Mr-hunt-007/Task-Tracker.github.io/refs/heads/main/Task-Tracker.png?height=600&width=1200" alt="TaskTracker App Preview" className="w-full h-auto" />
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management with TaskTracker.
          </p>
          <Button size="lg" variant="secondary" asChild className="px-8 py-6 text-lg rounded-full">
            <Link href="/dashboard">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold">TaskTracker</span>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © {new Date().getFullYear()} TaskTracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
