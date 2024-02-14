import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h1>{project.title}</h1>
      <h4>{project.intro}</h4>
      <div className="link-container">
        {project.github && (
          <a className="link-wrap" href={project.github} target="_blank">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        )}
        {project.homepage && (
          <a className="link-wrap" href={project.homepage} target="_blank">
            <FontAwesomeIcon icon={faHome} />
          </a>
        )}
      </div>
    </div>
  );
}
