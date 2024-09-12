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
    <section className="flex items-center justify-center py-24 md:py-36 lg:py-48">
      <div className="w-11/12 lg:w-[1280px] h-[500px] m-auto relative overflow-hidden">
        <div className="absolute z-50 flex justify-between w-full -translate-y-1/2 top-1/2">
          <button className={["text-5xl font-bold text-sub cursor-pointer after:content-['<']", !select && "opacity-60"].join(" ")} onClick={goPrev}></button>
          <button className={["text-5xl font-bold text-sub cursor-pointer after:content-['>']", select === total - 1 && "opacity-60"].join(" ")} onClick={goNext}></button>
        </div>
        <div className="flex items-center w-11/12 h-full m-auto transition-transform md:w-3/4 lg:w-4/5" style={{ transform: `translateX(${select * -100}%)`}}>
          {projects.map((project) => (
            <div className="flex items-center justify-center flex-grow flex-shrink-0 w-full h-full" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
