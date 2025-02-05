import { Timestamp } from "firebase/firestore"

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