import { Squircle } from './Squircle'

interface TestimonialProps {
  avatarUrl: string
  name: string
  title: string
  content: string
}

export function Testimonial({ avatarUrl, name, title, content }: TestimonialProps) {
  const lines = content.split('\n')

  return (
    <div className="p-4 flex gap-4 w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Squircle width={64} height={64} className="shrink-0">
        <img src={avatarUrl} alt={name} className="w-16 h-16" />
      </Squircle>
      <div className="my-auto space-y-2">
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
        </div>
        <div className="text-gray-700 dark:text-gray-300 font-light">
          {lines.map((line, index) => (
            <div key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
