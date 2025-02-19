import { ExperienceList } from '../components/ExperienceList'
import experienceData from '../data/experiences.json'
import { SectionTitle } from '../components/SectionTitle'

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience" className="p-4 mb-12 scroll-mt-16">
      <SectionTitle id="experience">Experience</SectionTitle>
      <ExperienceList experiences={experienceData.experiences} />
    </section>
  )
}
