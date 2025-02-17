interface SquircleProps {
  children: React.ReactNode
  width?: number
  height?: number
  className?: string
}

export function Squircle({ children, width = 200, height = 200, className = '' }: SquircleProps) {
  const svgMask = `data:image/svg+xml,%3csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M${width / 2} 0C${width / 10} 0 0 ${height / 10} 0 ${height / 2}s${width / 10} ${height / 2} ${width / 2} ${height / 2} ${width / 2}-${height / 10} ${width / 2}-${height / 2}S${width - width / 10} 0 ${width / 2} 0Z'/%3e%3c/svg%3e`

  return (
    <div
      className={className}
      style={{
        WebkitMaskImage: `url("${svgMask}")`,
        maskImage: `url("${svgMask}")`,
      }}
    >
      {children}
    </div>
  )
}
