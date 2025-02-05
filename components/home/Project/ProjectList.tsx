'use client'

import { useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects }: ProjectListPros) {
  const [select, setSelect] = useState<number>(0);
  const total = projects.length;
  
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
  return (
    <section id="project" className="flex flex-col justify-center items-center py-12 md:py-16 lg:py-28">
      <h1>Project</h1>
      <div className="w-11/12 lg:w-[1280px] h-[500px] m-auto relative overflow-hidden">
        <div className="flex absolute top-1/2 z-50 justify-between w-full -translate-y-1/2">
          <button className={["text-5xl font-bold text-sub cursor-pointer after:content-['<']", !select && "opacity-60"].join(" ")} onClick={goPrev}></button>
          <button className={["text-5xl font-bold text-sub cursor-pointer after:content-['>']", select === total - 1 && "opacity-60"].join(" ")} onClick={goNext}></button>
        </div>
        <div className="flex items-center m-auto w-11/12 h-full transition-transform md:w-3/4 lg:w-4/5" style={{ transform: `translateX(${select * -100}%)` }}>
          {projects.map((project) => (
            <div className="flex flex-grow flex-shrink-0 justify-center items-center w-full h-full" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}