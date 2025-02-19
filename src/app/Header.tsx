import { useDarkMode } from '../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Logo } from '../components/Logo'
export function Header() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <header className="sticky top-0 z-10 w-full bg-white/90 dark:bg-primary-950/90">
      <div className="max-w-7xl mx-auto flex justify-between py-2">
        <Link to="/" className="my-auto ml-4">
          <Logo className="w-6 h-6" />
        </Link>
        <nav className="flex gap-2 my-auto"></nav>
        <button
          onClick={toggleDarkMode}
          className="mr-2 px-2 my-auto h-8 rounded-lg hover:bg-primary-100 transition-colors dark:hover:text-white dark:hover:bg-primary-700 cursor-pointer ring-none focus:ring-none"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-primary-200 fill-primary-500" />
          ) : (
            <Moon className="w-5 h-5 text-primary-700 fill-primary-200" />
          )}
        </button>
      </div>
    </header>
  )
}
