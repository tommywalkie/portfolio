import { Squircle } from './Squircle'
import { LinkedInButton } from './LinkedInButton'

interface TestimonialProps {
  avatarUrl: string
  name: string
  title: string
  content: string
  linkedIn?: string
}

export function Testimonial({ avatarUrl, name, title, content, linkedIn }: TestimonialProps) {
  const lines = content.split('\n')

  return (
    <div className="p-4 flex gap-4 w-full max-w-2xl bg-primary-50 dark:bg-primary-900 rounded-lg">
      <Squircle width={64} height={64} className="shrink-0">
        <img src={avatarUrl} alt={name} className="w-16 h-16" />
      </Squircle>
      <div className="my-auto space-y-2">
        <div>
          <div className="flex items-center gap-2 justify-between">
            <div className="font-bold text-xl text-primary-700 dark:text-primary-100">{name}</div>
            {linkedIn && <LinkedInButton href={linkedIn} className="translate-y-[1px] w-6 h-6 ml-auto" />}
          </div>
          <div className="text-md text-secondary-600 dark:text-secondary-500">{title}</div>
        </div>
        <div className="text-primary-900 dark:text-primary-100 font-light text-lg">
          {lines.map((line, index) => (
            <span key={index} className={index < lines.length - 1 ? 'block mb-4' : 'block'}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
