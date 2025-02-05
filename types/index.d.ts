interface ProjectCardProps {
  project: Project
}

interface Project {
  title: string
  intro: string
  organization: string
  startDate: Date
  endDate: Date
  github: string
  homepage: string
  notion: string
}