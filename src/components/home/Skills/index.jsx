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
import reactSvg from "assets/images/icons/react.svg";
import nextdotjsSvg from "assets/images/icons/nextdotjs.svg";
import recoilSvg from "assets/images/icons/recoil.svg";
import vuedotjsSvg from "assets/images/icons/vuedotjs.svg";
import jquerySvg from "assets/images/icons/jquery.svg";
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
    { title: "Firebase", image: firebaseSvg, content: "Firestore 이용한 No SQL 사용", level: 1 },
    { title: "React", image: reactSvg, content: "SPA 서비스 제작 및 업무 경험", level: 4 },
    { title: "Next.js", image: nextdotjsSvg, content: "SSR 프로젝트 제작", level: 2 },
    { title: "Recoil", image: recoilSvg, content: "React 상태관리 라이브러리", level: 2 },
    { title: "Vue.js", image: vuedotjsSvg, content: "SPA 서비스 제작 및 업무 경험", level: 4 },
    { title: "JQuery", image: jquerySvg, content: "서비스 제작 및 업무 경험", level: 4 },
    { title: "Sass", image: sassSvg, content: "", level: 4 },
    { title: "styled-components", image: styledcomponentsSvg, content: "", level: 3 },
    { title: "Tailwind CSS", image: tailwindcssSvg, content: "", level: 4 },
    { title: "Bootstrap", image: bootstrapSvg, content: "", level: 4 },
    { title: "MUI", image: muiSvg, content: "", level: 4 },
  ];
  return (
    <section className="skills">
      <h1>SKILLS</h1>
      <div className="skill-container">
        {skills.map((skill, idx) => (
          <div className="skill-wrap" key={idx}>
            <div className="skill-detail">
              <h3>
                {skill.title}
              </h3>
              <div className="level-wrap">
                {Array(skill.level).fill().map((_, idx) => <FontAwesomeIcon key={idx} icon={faStar} style={{color: "#FFD43B"}} />)}
              </div>
              {skill.content ? <p>{skill.content}</p> : null}
            </div>
            <img src={skill.image} alt={skill.title} />
          </div>
        ))}
      </div>
    </section>
  );
}
