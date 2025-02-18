import { createFileRoute } from '@tanstack/react-router'
import { TextSlider } from '../components/TextSlider'
import { Squircle } from '../components/Squircle'
import { Testimonial } from '../components/Testimonial'
import { ExperienceList } from '../components/ExperienceList'
import testimonialData from '../data/testimonials.json'
import experienceData from '../data/experiences.json'
import GithubIcon from '../assets/github.svg?react'
import LinkedInIcon from '../assets/linkedin.svg?react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const mainSkills = ['React', 'TypeScript', 'Node.js', 'NestJS', 'TailwindCSS', 'PHP']

  return (
    <div>
      <div className="p-4 flex flex-col sm:flex-row gap-8 w-full justify-center items-center my-4 sm:my-8 md:my-16">
        <Squircle width={128} height={128} className="min-w-max my-auto">
          <img src="/photo.jpg" alt="profile" className="w-32 h-32" />
        </Squircle>
        <div className="my-auto">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Hello there! 👋</div>
          <div className="text-2xl sm:text-3xl md:text-4xl pr-5 mb-4">
            I'm Tom Bazarnik, a fullstack engineer who likes <br className="hidden xl:block" />
            building projects with <TextSlider words={mainSkills} />
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/tommywalkie" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="w-8 h-8 fill-primary-300 hover:fill-primary dark:fill-primary dark:hover:fill-primary-300" />
            </a>
            <a href="https://www.linkedin.com/in/tom-bazarnik-a4364010b/" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="w-8 h-8 fill-primary-300 hover:fill-primary dark:fill-primary dark:hover:fill-primary-300" />
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
        <ExperienceList experiences={experienceData.experiences} />
      </div>

      <div className="p-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
        <div className="flex flex-col gap-4 w-full items-center">
          {testimonialData.testimonials.map((testimonial) => (
            <Testimonial key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  )
}
