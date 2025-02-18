import LinkedInIcon from '../assets/linkedin.svg?react'
import clsx from 'clsx'

interface LinkedInButtonProps {
  href: string
  className?: string
}

export function LinkedInButton({ href, className = 'w-8 h-8' }: LinkedInButtonProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <LinkedInIcon
        className={clsx('fill-primary-300 hover:fill-primary dark:fill-primary dark:hover:fill-primary-300', className)}
      />
    </a>
  )
}
