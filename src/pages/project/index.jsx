import api from "api";
import React, { useEffect, useState } from "react";

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
    <article>
      {projects.map((project) => (
        <div key={project.id}>
          <h1>{project.title}</h1>
        </div>
      ))}
    </article>
  );
}
