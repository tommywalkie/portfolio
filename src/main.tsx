import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { injectLiwanScript } from './analytics'

// Initialize dark mode before app renders
if (
  localStorage.getItem('color-theme') === 'dark' ||
  (!localStorage.getItem('color-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

if (import.meta.env.PROD && window.location.hostname === 'tommywalkie.com') {
  injectLiwanScript('my-portfolio')
}

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMs: 0,
  defaultPendingComponent: () => (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-3 font-semibold text-lg pb-28">
      Loading...
    </div>
  ),
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
