import { Fragment } from 'react'
import { Squircle } from './Squircle'
import { formatDateRange } from '../utils/dates'
import type { Experience } from '../types'
import { LinkedInButton } from './LinkedInButton'
import { LinkIcon } from 'lucide-react'

// Shared components
function DateDisplay({ startDate, endDate }: { startDate: string; endDate: string | null }) {
  const { formattedStartDate, formattedEndDate, durationStr } = formatDateRange(startDate, endDate)
  return (
    <div className="text-sm text-secondary-600 dark:text-secondary-500">
      {formattedStartDate} - {formattedEndDate}{' '}
      <span className="text-primary-700 dark:text-primary-300 ml-1">({durationStr})</span>
    </div>
  )
}

function Description({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="text-primary-900 dark:text-primary-100 font-light">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </div>
  )
}

function TechnologyList({ technologies }: { technologies: string[] }) {
  if (!technologies.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span key={tech} className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-800 rounded-full">
          {tech}
        </span>
      ))}
    </div>
  )
}

function CompanyLinks({ url, linkedIn }: { url?: string; linkedIn?: string }) {
  if (!url && !linkedIn) return null

  return (
    <div className="inline-flex gap-2 ml-auto pl-3">
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Company website">
          <LinkIcon className="w-5 h-5 text-primary-300 hover:text-primary dark:text-primary dark:hover:text-primary-300" />
        </a>
      )}
      {linkedIn && <LinkedInButton href={linkedIn} className="w-5 h-5" />}
    </div>
  )
}

type ExperienceItemProps = Experience

export function ExperienceItem({
  companyLogo,
  companyName,
  companyUrl,
  companyLinkedIn,
  role,
  startDate,
  endDate,
  description,
  technologies = [],
  subExperiences = [],
}: ExperienceItemProps) {
  return (
    <div className="p-6 w-full bg-primary-50 dark:bg-primary-900 rounded-lg space-y-4">
      <div className="flex gap-4">
        <Squircle width={64} height={64} className="shrink-0">
          <img src={companyLogo} alt={companyName} className="w-16 h-16" />
        </Squircle>
        <div className="flex-grow">
          <div className="flex items-center">
            <div className="font-bold text-xl text-primary-900 dark:text-primary-100">{companyName}</div>
            <CompanyLinks url={companyUrl} linkedIn={companyLinkedIn} />
          </div>
          <div className="text-lg font-semibold text-primary-700 dark:text-primary-300">{role}</div>
          <DateDisplay startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <Description text={description} />
      <TechnologyList technologies={technologies} />

      {subExperiences.length > 0 && (
        <div className="mt-6 space-y-4 pl-6 border-l-2 border-primary-200 dark:border-primary-700">
          {subExperiences.map((subExp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-4">
                {subExp.companyLogo && (
                  <Squircle width={48} height={48} className="shrink-0 mt-1.5">
                    <img src={subExp.companyLogo} alt={subExp.companyName || ''} className="w-12 h-12" />
                  </Squircle>
                )}
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="font-semibold text-lg">{subExp.role}</div>
                    <CompanyLinks url={subExp.companyUrl} linkedIn={subExp.companyLinkedIn} />
                  </div>
                  {subExp.companyName && (
                    <div className="text-primary-700 dark:text-primary-300">{subExp.companyName}</div>
                  )}
                  <DateDisplay startDate={subExp.startDate} endDate={subExp.endDate} />
                </div>
              </div>
              <Description text={subExp.description} />
              <TechnologyList technologies={subExp.technologies || []} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
