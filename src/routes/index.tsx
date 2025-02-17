import { createFileRoute } from '@tanstack/react-router'
import { TextSlider } from '../components/TextSlider'
import { Squircle } from '../components/Squircle'
import { Testimonial } from '../components/Testimonial'

export const Route = createFileRoute('/')({
  component: Index,
})

const TESTIMONIALS = [
  {
    avatarUrl:
      'https://media.licdn.com/dms/image/v2/D4E03AQFJiENhxKg33w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1702403026065?e=1745452800&v=beta&t=vHHvR0wM8oenBA2sDb-gjoE68UZUIGezj2TedTYyr7g',
    name: 'Maxime Gaudin',
    title: 'CTO @ MadKudu',
    content:
      'I had the pleasure of working with Tom at MadKudu when he was a fullstack engineer, and I really enjoyed collaborating with him. He is kind, dedicated, and a true team player. Tom worked hard to contribute to key products at MadKudu and always strived to have a meaningful impact. His commitment and willingness to put in the effort made him a valuable member of the team!',
  },
  {
    avatarUrl:
      'https://media.licdn.com/dms/image/v2/D4E35AQFhf31jQB96hw/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1739352450558?e=1740427200&v=beta&t=A2QjsgnOz0mZNEVU3PRZFTQRhijQf126xiEFEZXn5DA',
    name: 'Adrien Kerros',
    title: 'Web Developer',
    content:
      'I had the opportunity to work with Tom at AREP-Exigences. He is a serious and dedicated colleague, always looking for the best solution. He is highly responsive and never hesitates to offer suggestions. He is someone you can always rely on.',
  },
  {
    avatarUrl:
      'https://media.licdn.com/dms/image/v2/D4E03AQE-RrJWObSN6g/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1714387403605?e=1745452800&v=beta&t=Dvvyvnz4px1JqZlLdItMtuxE_jWsA_DoHRbYRVPidkU',
    name: 'Ghassen Rjab',
    title: 'Fullstack Developer',
    content:
      'I had the pleasure of working with Tom for two years at MadKudu. He’s an exceptionally talented and pragmatic web developer, equally skilled in backend and frontend development. Tom is always on the lookout for the latest tools and libraries that can genuinely improve the stack. Thanks to him, we integrated TanStack React Query and TypeORM, which significantly boosted our efficiency and developer experience.\nBeyond work, what consistently amazed me was Tom’s dedication to side projects with his friends. His passion for building things never fades, and he’s always pushing boundaries and exploring new ideas.\nI wholeheartedly recommend Tom. Any team would be lucky to have him!',
  },
]

function Index() {
  const mainSkills = ['React', 'TypeScript', 'Node.js', 'NestJS']

  return (
    <div>
      <div className="p-4 flex flex-col sm:flex-row gap-8 w-full justify-center items-center my-4 sm:my-8 md:my-16">
        <Squircle width={128} height={128} className="min-w-max my-auto">
          <img src="/photo.jpg" alt="profile" className="w-32 h-32" />
        </Squircle>
        <div className="my-auto">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">Hello there! 👋</div>
          <div className="text-2xl sm:text-3xl md:text-4xl pr-5">
            I'm Tom Bazarnik, a fullstack engineer who likes <br className="hidden xl:block" />
            building projects with <TextSlider words={mainSkills} />
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4 w-full items-center">
        {TESTIMONIALS.map((testimonial) => (
          <Testimonial key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </div>
  )
}
