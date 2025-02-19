import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../app/Hero'
import { TestimonialsSection } from '../app/TestimonialsSection'
import { ExperienceSection } from '../app/ExperienceSection'
import { useEffect } from 'react'
import { ProjectsSection } from '../app/ProjectsSection'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // scroll to the section based on the url
  useEffect(() => {
    const section = window.location.hash
    if (section) {
      document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])
  return (
    <main>
      <Hero />
      <TestimonialsSection />
      <ExperienceSection />
      <ProjectsSection />
    </main>
  )
}
