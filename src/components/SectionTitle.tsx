interface SectionTitleProps {
  id: string
  children: React.ReactNode
}

export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2 id={id} className="text-3xl font-bold mb-8 text-center group">
      <a
        href={`#${id}`}
        className="text-primary-900 dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"
      >
        {children}
        <span className="inline-block ml-2 text-primary-400 dark:text-primary-600 opacity-0 group-hover:opacity-100">
          #
        </span>
      </a>
    </h2>
  )
}
