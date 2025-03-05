import { defineCollection, z } from 'astro:content'

export const collections = {
  interests: defineCollection({
    type: 'data',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
      order: z.number().optional(),
    }),
  }),
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
      companyType: z.string().optional(),
      teamSize: z.string().or(z.number()).optional(),
      contractType: z.string().optional(),
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
            companyType: z.string().optional(),
            teamSize: z.string().or(z.number()).optional(),
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
  // Education, some school entries may have sub-entries for degrees
  education: defineCollection({
    type: 'data',
    schema: z.object({
      school: z.string(),
      schoolUrl: z.string().optional(),
      schoolLogo: z.string().optional(),
      schoolLinkedIn: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      degree: z.string().optional(),
      skills: z.array(z.string()).optional(),
      degrees: z
        .array(
          z.object({
            degree: z.string(),
            startDate: z.string(),
            endDate: z.string(),
            description: z.string().optional(),
            skills: z.array(z.string()).optional(),
          }),
        )
        .optional(),
    }),
  }),
}
