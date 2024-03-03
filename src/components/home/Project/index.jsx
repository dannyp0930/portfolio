import React, { useEffect, useState } from "react";
import ProjectCard from "components/home/Project/ProjectCard";
import api from "api";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [select, setSelect] = useState(0);
  const [total, setTotal] = useState(0);

  async function getProjects() {
    const projects = await api.getDataList("project");
    setProjects(projects);
    setTotal(projects.length);
  }

  function goPrev() {
    if (select) {
      setSelect(select - 1);
    }
  }
  
  function goNext() {
    if (select < total - 1) {
      setSelect(select + 1);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <section className="project">
      <div className="carousel-container">
        <div className="nav-container">
          <button className={`nav-btn nav-prev ${!select ? "nav-disabled": ""}`} onClick={goPrev}></button>
          <button className={`nav-btn nav-next ${select === total - 1 ? "nav-disabled": ""}`} onClick={goNext}></button>
        </div>
        <div className="carousel-wrap" style={{ transform: `translateX(${select * -100}%)`}}>
          {projects.map((project) => (
            <div className="carousel-item" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
