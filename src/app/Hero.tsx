import { TextSlider } from '../components/TextSlider'
import { Squircle } from '../components/Squircle'
import { LinkedInButton } from '../components/LinkedInButton'
import { GithubButton } from '../components/GithubButton'
import React from 'react'

export function Hero() {
  const mainSkills = ['React', 'TypeScript', 'Node.js', 'NestJS', 'Tailwind CSS', 'PHP']

  const sections = [
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
  ] as const

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        window.history.pushState({}, '', `#${id}`)
      }, 500)
    }
  }

  return (
    <section
      aria-label="Introduction"
      className="p-4 flex flex-col lg:flex-row gap-8 w-full mx-auto justify-center items-center my-4 sm:my-8 md:my-16 px-10"
    >
      <Squircle width={128} height={128} className="min-w-max my-auto">
        <img src="/profiles/tom-bazarnik.jpg" alt="Tom Bazarnik's profile picture" className="w-32 h-32" />
      </Squircle>
      <div className="my-auto text-primary-900 dark:text-primary-100">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-primary-700 dark:text-primary-300">
          Hello there! 👋
        </h1>
        <div className="text-2xl sm:text-3xl md:text-4xl pr-5 mb-4">
          I'm Tom Bazarnik, a fullstack engineer based in{' '}
          <span className="text-primary-400 dark:text-primary-300">Paris</span> who likes{' '}
          <br className="hidden xl:block" />
          building projects with <TextSlider words={mainSkills} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3" aria-label="Social links">
            <LinkedInButton href="https://www.linkedin.com/in/tom-bazarnik-a4364010b/" />
            <GithubButton href="https://github.com/tommywalkie" />
          </div>
          <ul className="flex items-center gap-4 text-md md:text-lg list-none" aria-label="Main navigation">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <li>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 cursor-pointer"
                  >
                    {section.label}
                  </button>
                </li>
                {index < sections.length - 1 && (
                  <li
                    className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary-600 dark:bg-secondary-500"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
