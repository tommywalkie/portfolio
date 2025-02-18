import { useDarkMode } from '../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function Header() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <header className="p-2 flex justify-between sticky top-0 transition-colors bg-color-secondary text-color-primary dark:bg-color-primary dark:text-white z-10">
      <nav className="flex gap-2 my-auto"></nav>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 cursor-pointer ring-none focus:ring-none"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  )
}
