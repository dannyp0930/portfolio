import { Timestamp } from "firebase/firestore"

declare global {
  interface ProjectListPros {
    projects: Project[]
  }

  interface ProjectCardProps {
    project: Project
  }

  interface RawProject {
    id: string
    title: string
    intro: string
    organization: string
    startDate: Timestamp
    endDate: Timestamp
    github: string
    homepage: string
    notion: string
  }
  
  interface Project {
    id: string
    title: string
    intro: string
    organization: string
    startDate: string
    endDate: string
    github: string
    homepage: string
    notion: string
  }

  interface Career {
    id: string
    companyName: string,
    period: string,
    description: string,
    position: string,
    duty: string,
    content: string,
    detail: CareerDetail[]
  }

  interface CareerDetail {
    title: string
    content: string[]
  }
}

export {}