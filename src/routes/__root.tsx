import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '../components/Header'

function Root() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: Root,
})
