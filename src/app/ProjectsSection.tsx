import { ProjectList } from '../components/ProjectList'
import projectsData from '../data/projects.json'
import { SectionTitle } from '../components/SectionTitle'

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects" className="p-4 mb-12 scroll-mt-16">
      <SectionTitle id="projects">Projects</SectionTitle>
      <ProjectList projects={projectsData.projects} />
    </section>
  )
}
