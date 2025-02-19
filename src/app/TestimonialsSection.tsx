import { Testimonial } from '../components/Testimonial'
import testimonialData from '../data/testimonials.json'
import LinkedInIcon from '../assets/linkedin.svg?react'
import { SectionTitle } from '../components/SectionTitle'

export function TestimonialsSection() {
  return (
    <section id="testimonials" aria-labelledby="testimonials" className="p-4 mb-12 scroll-mt-16">
      <SectionTitle id="testimonials">Testimonials</SectionTitle>
      <div className="flex flex-col gap-4 w-full items-center mb-8" role="list" aria-label="List of testimonials">
        {testimonialData.testimonials.map((testimonial) => (
          <div key={testimonial.name} role="listitem">
            <Testimonial {...testimonial} />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <a
          href="https://www.linkedin.com/in/tom-bazarnik-a4364010b/edit/forms/recommendation/write/?profileUrn=urn%3Ali%3Afsd_profile%3AACoAABuuQdMB0y66BCNammBKG2dsPmr41tCjXWQ"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Submit a LinkedIn recommendation"
        >
          <button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:text-primary-100 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-md cursor-pointer flex items-center">
            <LinkedInIcon className="fill-primary-200 dark:fill-primary-100 w-4 h-4 mr-2" aria-hidden="true" />
            Submit a recommendation for me
          </button>
        </a>
      </div>
    </section>
  )
}
