import { Timestamp } from "firebase/firestore"

declare global {
  interface ProjectCardProps {
    project: Project
  }
  
  interface Project {
    title: string
    intro: string
    organization: string
    startDate: Timestamp
    endDate: Timestamp
    github: string
    homepage: string
    notion: string
  }
}

export {}