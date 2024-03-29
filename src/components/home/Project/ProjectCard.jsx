import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import notionSvg from "assets/images/icons/notion.svg";
import { timeToDate } from "utils";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h1>{project.title}<span>{project.organization}</span></h1>
      <h4>{project.intro}</h4>
      <p>
        {timeToDate(project.startDate)} ~ {project.endDate ? timeToDate(project.endDate) : null}
      </p>
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
        {project.notion && (
          <a className="link-wrap" href={project.notion} target="_blank">
            <img src={notionSvg} alt="" />
          </a>
        )}
      </div>
    </div>
  );
}
