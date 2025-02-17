import { useState, useEffect } from 'react'

export function useDarkMode() {
  // Initialize state based on current DOM state
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const updateTheme = (dark: boolean) => {
    // Update DOM
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save preference
    localStorage.setItem('color-theme', dark ? 'dark' : 'light')
    setIsDark(dark)
  }

  const toggleDarkMode = () => {
    updateTheme(!isDark)
  }

  useEffect(() => {
    // Check for saved preference first
    const savedTheme = localStorage.getItem('color-theme')
    if (savedTheme) {
      updateTheme(savedTheme === 'dark')
    } else {
      // If no saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      updateTheme(prefersDark)
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if there's no saved preference
      if (!localStorage.getItem('color-theme')) {
        updateTheme(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, []) // Empty dependency array since we only want this to run once on mount

  return {
    isDark,
    toggleDarkMode,
  }
}
