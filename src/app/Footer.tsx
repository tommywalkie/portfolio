import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="mt-auto bg-primary-100 dark:bg-primary-800 w-full">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-primary-900 dark:text-primary-100">
            © {new Date().getFullYear()} Tom Bazarnik. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
