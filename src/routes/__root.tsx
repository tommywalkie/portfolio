import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '../components/Header'

function Root() {
  return (
    <div className="dark:bg-gray-900 dark:text-white transition-colors min-h-screen">
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: Root,
})
