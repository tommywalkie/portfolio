import { defineCollection, z } from 'astro:content'

export const collections = {
  testimonials: defineCollection({
    type: 'content',
    schema: z.object({
      avatarUrl: z.string(),
      name: z.string(),
      title: z.string(),
      linkedIn: z.string().optional(),
      company: z
        .object({
          name: z.string(),
        })
        .optional(),
      order: z.number(),
    }),
  }),
  experiences: defineCollection({
    type: 'content',
    schema: z.object({
      companyLogo: z.string(),
      companyName: z.string(),
      companyUrl: z.string().optional(),
      companyLinkedIn: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      role: z.string(),
      technologies: z.array(z.string()),
      subExperiences: z
        .array(
          z.object({
            role: z.string(),
            startDate: z.string(),
            endDate: z.string(),
            companyName: z.string(),
            companyLogo: z.string().optional(),
            companyUrl: z.string().optional(),
            companyLinkedIn: z.string().optional(),
            description: z.string(),
            technologies: z.array(z.string()).optional(),
          }),
        )
        .optional(),
    }),
  }),
  projects: defineCollection({
    type: 'content',
    schema: z.object({
      name: z.string(),
      technologies: z.array(z.string()),
      url: z.string().optional(),
      githubUrl: z.string().optional(),
      isCurrentSite: z.boolean().optional(),
      logo: z.string(),
      order: z.number(),
    }),
  }),
}
