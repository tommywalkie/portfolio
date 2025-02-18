import { ExperienceItem } from './ExperienceItem'

interface Experience {
  companyLogo: string
  companyName: string
  period: string
  role: string
  description: string
  technologies?: string[]
  subExperiences?: Array<{
    role: string
    period: string
    description: string
    technologies?: string[]
  }>
}

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