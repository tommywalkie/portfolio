import { ProjectItem } from './ProjectItem'
import type { Project } from '../types'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {projects.map((project) => (
        <ProjectItem key={project.name} {...project} />
      ))}
    </div>
  )
}
