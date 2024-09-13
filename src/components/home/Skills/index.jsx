import React from "react";
import htmlSvg from "assets/images/icons/html5.svg";
import css3Svg from "assets/images/icons/css3.svg";
import gitSvg from "assets/images/icons/git.svg";
import jiraSvg from "assets/images/icons/jira.svg";
import pythonSvg from "assets/images/icons/python.svg";
import javascriptSvg from "assets/images/icons/javascript.svg";
import typescriptSvg from "assets/images/icons/typescript.svg";
import firebaseSvg from "assets/images/icons/firebase.svg";
import LinuxSvg from "assets/images/icons/linux.svg";
import nodedotjsSvg from "assets/images/icons/nodedotjs.svg";
import jenkinsSvg from "assets/images/icons/jenkins.svg";
import reactSvg from "assets/images/icons/react.svg";
import vuedotjsSvg from "assets/images/icons/vuedotjs.svg";
import jquerySvg from "assets/images/icons/jquery.svg";
import nextdotjsSvg from "assets/images/icons/nextdotjs.svg";
import recoilSvg from "assets/images/icons/recoil.svg";
import sassSvg from "assets/images/icons/sass.svg";
import styledcomponentsSvg from "assets/images/icons/styledcomponents.svg";
import tailwindcssSvg from "assets/images/icons/tailwindcss.svg";
import bootstrapSvg from "assets/images/icons/bootstrap.svg";
import muiSvg from "assets/images/icons/mui.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function Skills() {
  const skills = [
    { title: "HTML", image: htmlSvg, content: "SEO를 위한 시멘틱 태그 사용", level: 4 },
    { title: "CSS", image: css3Svg, content: "Class별 스타일링 선호", level: 4 },
    { title: "Git", image: gitSvg, content: "소스코드 버전 관리 및 프로젝트 협업 경험", level: 2 },
    { title: "Jira", image: jiraSvg, content: "프로젝트 일정 관리 및 협업 툴 사용", level: 3 },
    { title: "Python", image: pythonSvg, content: "기본 파이썬 문법 이해, 라이브러리를 사용한 알고리즘 구현", level: 2 },
    { title: "JavaScript", image: javascriptSvg, content: "기본 자바스크립트 문법 이해, 자바스크립트 프레임 워크 사용", level: 3 },
    { title: "TypeScript", image: typescriptSvg, content: "타입, 인터페이스 사용하여 정적 타입 명시", level: 2 },
    { title: "Linux", image: LinuxSvg, content: "리눅스 서버 환경에서의 배포 경험", level: 2 },
    { title: "Node.js", image: nodedotjsSvg, content: "Node.js 서버 배포 경험", level: 2 },
    { title: "Jenkins", image: jenkinsSvg, content: "Jenkins 자동 배포 경험", level: 2 },
    { title: "Firebase", image: firebaseSvg, content: "Firestore 이용한 No SQL 사용", level: 1 },
    { title: "React", image: reactSvg, content: "SPA 서비스 제작 및 업무 경험", level: 4 },
    { title: "Vue.js", image: vuedotjsSvg, content: "SPA 서비스 제작 및 업무 경험", level: 4 },
    { title: "JQuery", image: jquerySvg, content: "서비스 제작 및 업무 경험", level: 4 },
    { title: "Next.js", image: nextdotjsSvg, content: "SSR 프로젝트 제작", level: 2 },
    { title: "Recoil", image: recoilSvg, content: "React 상태관리 라이브러리", level: 2 },
    { title: "Sass", image: sassSvg, content: "", level: 4 },
    { title: "styled-components", image: styledcomponentsSvg, content: "", level: 3 },
    { title: "Tailwind CSS", image: tailwindcssSvg, content: "", level: 4 },
    { title: "Bootstrap", image: bootstrapSvg, content: "", level: 4 },
    { title: "MUI", image: muiSvg, content: "", level: 4 },
  ];
  return (
    <section className="box-border flex flex-col items-center justify-center gap-5 py-12 bg-white md:pt-36 lg:pt-48 md:gap-12">
      <h1>SKILLS</h1>
      <div className="box-border grid items-center grid-cols-4 gap-4 p-5 bg-slate-100 lg:grid-cols-6 md:grid-cols-5 w-72 md:w-11/12 lg:w-3/5 lg:p-14 rounded-2xl md:gap-12">
        {skills.map((skill, idx) => (
          <div className="relative transition-transform cursor-pointer hover:-translate-y-5 group" key={idx}>
            <div className="absolute top-0 z-50 hidden w-40 p-3 max-h-40 md:max-h-auto overflow-y-auto -translate-x-1/2 bg-white border border-solid rounded-lg skill-detail border-theme-sub md:w-48 lg:w-72 left-1/2 md:p-5 hover:md:-translate-y-5 group-hover:block group-hover:-translate-y-[calc(100%+5px)] md:group-hover:-translate-y-[calc(100%+20px)]">
              <h3 className="text-lg md:text-2xl">
                {skill.title}
              </h3>
              <div className="pt-3">
                {Array(skill.level).fill().map((_, idx) => <FontAwesomeIcon key={idx} icon={faStar} style={{color: "#FFD43B"}} />)}
              </div>
              {skill.content ? <p className="mt-3 whitespace-pre-wrap break-keep">{skill.content}</p> : null}
            </div>
            <img className="object-cover w-full h-full" src={skill.image} alt={skill.title} />
          </div>
        ))}
      </div>
    </section>
  );
}
