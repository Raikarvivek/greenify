'use client'

import { useTheme } from '@/app/lib/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Theme toggle"
        disabled
      >
        <Moon className="h-5 w-5 text-gray-600" />
      </button>
    )
  }

  try {
    const { theme, toggleTheme } = useTheme()

    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </button>
    )
  } catch (error) {
    // Fallback if theme context is not available
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Theme toggle"
        disabled
      >
        <Moon className="h-5 w-5 text-gray-600" />
      </button>
    )
  }
}
