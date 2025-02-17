import { Link } from '@tanstack/react-router'
import { useDarkMode } from '../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function Header() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <header className="p-2 flex justify-between sticky top-0 transition-colors bg-white dark:bg-gray-900 dark:text-white z-10">
      <nav className="flex gap-2 my-auto">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/typography" className="[&.active]:font-bold">
          Typography
        </Link>
      </nav>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  )
}
