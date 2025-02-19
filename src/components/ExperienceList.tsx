import { ExperienceItem } from './ExperienceItem'
import type { Experience } from '../types'

interface ExperienceListProps {
  experiences: Experience[]
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {experiences.map((experience, index) => (
        <ExperienceItem key={index} {...experience} />
      ))}
    </div>
  )
}
