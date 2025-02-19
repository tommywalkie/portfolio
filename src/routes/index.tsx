import { createFileRoute } from '@tanstack/react-router'
import { TextSlider } from '../components/TextSlider'
import { Squircle } from '../components/Squircle'
import { Testimonial } from '../components/Testimonial'
import { ExperienceList } from '../components/ExperienceList'
import testimonialData from '../data/testimonials.json'
import experienceData from '../data/experiences.json'
import LinkedInIcon from '../assets/linkedin.svg?react'
import { LinkedInButton } from '../components/LinkedInButton'
import { GithubButton } from '../components/GithubButton'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const mainSkills = ['React', 'TypeScript', 'Node.js', 'NestJS', 'Tailwind CSS', 'PHP']

  return (
    <div>
      <div className="p-4 flex flex-col lg:flex-row gap-8 w-full mx-auto justify-center items-center my-4 sm:my-8 md:my-16 px-10">
        <Squircle width={128} height={128} className="min-w-max my-auto">
          <img src="/profiles/tom-bazarnik.jpg" alt="profile" className="w-32 h-32" />
        </Squircle>
        <div className="my-auto text-primary-900 dark:text-primary-100">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-primary-700 dark:text-primary-300">
            Hello there! 👋
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl pr-5 mb-4">
            I'm Tom Bazarnik, a fullstack engineer who likes <br className="hidden xl:block" />
            building projects with <TextSlider words={mainSkills} />
          </div>
          <div className="flex gap-3">
            <LinkedInButton href="https://www.linkedin.com/in/tom-bazarnik-a4364010b/" />
            <GithubButton href="https://github.com/tommywalkie" />
          </div>
        </div>
      </div>

      <div className="p-4 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
        <div className="flex flex-col gap-4 w-full items-center mb-8">
          {testimonialData.testimonials.map((testimonial) => (
            <Testimonial key={testimonial.name} {...testimonial} />
          ))}
        </div>
        <div className="flex justify-center hidden">
          <a
            href="https://www.linkedin.com/in/tom-bazarnik-a4364010b/recommendation-add-edit/WRITE_RECOMMENDATION"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 dark:bg-primary-900 dark:text-primary-100 dark:hover:bg-primary-800 cursor-pointer flex items-center">
              <LinkedInIcon className="fill-primary-300 dark:fill-primary-100 w-4 h-4 mr-2" />
              Submit a recommendation for me
            </button>
          </a>
        </div>
      </div>

      <div className="p-4 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
        <ExperienceList experiences={experienceData.experiences} />
      </div>
    </div>
  )
}
