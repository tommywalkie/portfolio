export interface SubExperience {
  role: string
  startDate: string
  endDate: string | null
  description: string
  technologies?: string[]
  companyLogo?: string
  companyName?: string
  companyUrl?: string
  companyLinkedIn?: string
}

export interface Experience {
  companyLogo: string
  companyName: string
  companyUrl?: string
  companyLinkedIn?: string
  startDate: string
  endDate: string | null
  role: string
  description: string
  technologies: string[]
  subExperiences?: SubExperience[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  isCurrentSite?: boolean
  logo?: string
  preview?: string
}
