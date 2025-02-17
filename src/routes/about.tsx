import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
  pendingMs: 0,
})

function About() {
  return <div className="p-2">Hello from About!</div>
}
