import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '../app/Header'
import { Footer } from '../app/Footer'

function Root() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  )
}

export const Route = createRootRoute({
  component: Root,
})
