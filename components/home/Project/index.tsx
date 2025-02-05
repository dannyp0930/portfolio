import api from "@/api";
import ProjectList from "./ProjectList";

function convertTimestamps(project: RawProject) {
  console.log(project.startDate)
  return {
    ...project,
    startDate: project.startDate.toDate().toISOString(),
    endDate: project.endDate?.toDate().toISOString()
  }
}

export default async function Project() {
  const rawProjects = await api.getDataList("project", "startDate") as RawProject[];
  const projects = rawProjects.map(convertTimestamps) as Project[];
  return <ProjectList projects={projects} />;
}
