import GithubIcon from '../assets/github.svg?react'
import clsx from 'clsx'

interface GithubButtonProps {
  href: string
  className?: string
}

export function GithubButton({ href, className = 'w-8 h-8' }: GithubButtonProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <GithubIcon
        className={clsx('fill-primary-300 hover:fill-primary dark:fill-primary dark:hover:fill-primary-300', className)}
      />
    </a>
  )
}
