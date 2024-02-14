import React, { useEffect, useState } from "react";
import ProjectCard from "components/pages/project/ProjectCard";
import api from "api";

export default function Project() {
  const [projects, setProjects] = useState([]);

  async function getProjects() {
    const projects = await api.getDataList("project");
    setProjects(projects);
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <article id="project">
      <section className="card-container">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </article>
  );
}
