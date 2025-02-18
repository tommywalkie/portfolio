import { Squircle } from "./Squircle"

interface SubExperience {
  role: string
  period: string
  description: string
  technologies?: string[]
  companyLogo?: string
  companyName?: string
}

interface ExperienceItemProps {
  companyLogo: string
  companyName: string
  period: string
  role: string
  description: string
  technologies?: string[]
  subExperiences?: SubExperience[]
}

export function ExperienceItem({
  companyLogo,
  companyName,
  period,
  role,
  description,
  technologies = [],
  subExperiences = [],
}: ExperienceItemProps) {
  const lines = description.split('\n')

  return (
    <div className="p-6 w-full bg-primary-50 dark:bg-primary-900 rounded-lg space-y-4">
      <div className="flex gap-4">
        <Squircle width={64} height={64} className="shrink-0">
          <img 
            src={companyLogo} 
            alt={companyName} 
            className="w-16 h-16"
          />
        </Squircle>
        <div className="space-y-1">
          <div className="font-bold text-xl">{companyName}</div>
          <div className="text-lg font-semibold text-primary-700 dark:text-primary-300">{role}</div>
          <div className="text-sm text-tertiary-600 dark:text-tertiary">{period}</div>
        </div>
      </div>

      <div className="text-primary-900 dark:text-primary-100 font-light">
        {lines.map((line, index) => (
          <div key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </div>
        ))}
      </div>

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-800 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {subExperiences.length > 0 && (
        <div className="mt-6 space-y-4 pl-6 border-l-2 border-primary-200 dark:border-primary-700">
          {subExperiences.map((subExp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-4">
                {subExp.companyLogo && (
                  <Squircle width={48} height={48} className="shrink-0 mt-1.5">
                    <img 
                      src={subExp.companyLogo} 
                      alt={subExp.companyName || ''} 
                      className="w-12 h-12"
                    />
                  </Squircle>
                )}
                <div className="">
                  <div className="font-semibold text-lg">{subExp.role}</div>
                  {subExp.companyName && (
                    <div className="text-primary-700 dark:text-primary-300">
                      {subExp.companyName}
                    </div>
                  )}
                  <div className="text-sm text-tertiary-600 dark:text-tertiary">{subExp.period}</div>
                </div>
              </div>
              <div className="text-primary-900 dark:text-primary-100 font-light">
                {subExp.description.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {line}
                    {lineIndex < subExp.description.split('\n').length - 1 && <br />}
                  </div>
                ))}
              </div>
              {subExp.technologies && subExp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subExp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-800 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 