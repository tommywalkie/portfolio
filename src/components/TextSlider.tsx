import { useEffect, useState } from 'react'

interface TextSliderProps {
  words: string[]
}

export function TextSlider({ words }: TextSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % words.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="relative overflow-hidden inline-block align-bottom min-w-[150px] whitespace-nowrap pr-3 pb-2 -mb-2 mr-6 sm:mr-12">
      <span className="opacity-0 select-none">{words[currentIndex]}</span>
      {words.map((word, index) => (
        <span
          key={word}
          className={`absolute left-0 transition-all duration-500 ease-in-out font-semibold text-blue-500 dark:text-blue-400 ${
            index === currentIndex
              ? 'translate-y-0 opacity-100'
              : index < currentIndex
                ? '-translate-y-full opacity-0 select-none'
                : 'translate-y-full opacity-0 select-none'
          }`}
          style={{ transform: `translateY(${(index - currentIndex) * 100}%)` }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
