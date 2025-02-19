import { GithubButton } from './GithubButton'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import type { Project } from '../types'
import { Squircle } from './Squircle'

export function ProjectItem({ name, description, technologies, url, githubUrl, isCurrentSite, logo }: Project) {
  return (
    <div className="p-6 w-full bg-primary-50 dark:bg-primary-900 rounded-lg space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          {logo && (
            <Squircle width={48} height={48} className="shrink-0">
              <img src={logo} alt={`${name} logo`} className="w-12 h-12" />
            </Squircle>
          )}
          <div>
            <div className="font-bold text-xl text-primary-700 dark:text-primary-100">
              {name}
              {isCurrentSite && (
                <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400 font-normal">
                  (psst, you're looking at it)
                </span>
              )}
            </div>
            <div className="text-primary-900 dark:text-primary-100 font-light mt-2">{description}</div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Visit project">
              <SquareArrowOutUpRightIcon className="w-6 h-6 text-primary-300 hover:text-primary dark:text-primary dark:hover:text-primary-300" />
            </a>
          )}
          {githubUrl && <GithubButton href={githubUrl} className="w-6 h-6" />}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span key={tech} className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-800 rounded-full">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
