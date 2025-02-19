import { Squircle } from './Squircle'
import { LinkedInButton } from './LinkedInButton'

interface TestimonialProps {
  avatarUrl: string
  name: string
  title: string
  content: string
  linkedIn?: string
}

function TestimonialContent({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <span key={index} className={index < lines.length - 1 ? 'block mb-4' : 'block'}>
          {line}
        </span>
      ))}
    </>
  )
}

export function Testimonial({ avatarUrl, name, title, content, linkedIn }: TestimonialProps) {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 bg-primary-50 dark:bg-primary-900 rounded-lg  w-full max-w-2xl">
      <div className="flex gap-4 w-full">
        <Squircle width={64} height={64} className="shrink-0">
          <img src={avatarUrl} alt={name} className="w-16 h-16" />
        </Squircle>
        <div className="my-auto space-y-2 w-full">
          <div>
            <div className="flex items-center gap-2 justify-between">
              <div className="font-bold text-xl text-primary-700 dark:text-primary-100">{name}</div>
              {linkedIn && <LinkedInButton href={linkedIn} className="translate-y-[1px] w-6 h-6 ml-auto" />}
            </div>
            <div className="text-md text-secondary-600 dark:text-secondary-500">{title}</div>
          </div>
          <div className="text-primary-900 dark:text-primary-100 font-light text-lg hidden md:block">
            <TestimonialContent content={content} />
          </div>
        </div>
      </div>
      <div className="text-primary-900 dark:text-primary-100 font-light text-md block md:hidden">
        <TestimonialContent content={content} />
      </div>
    </div>
  )
}
