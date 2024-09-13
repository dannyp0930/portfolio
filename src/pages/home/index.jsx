import React from "react";
import Banner from "components/home/Banner";
import Project from "components/home/Project";
import Info from "components/home/Info";
import Skills from "components/home/Skills";
import Career from "components/home/Career";

export default function Home() {
  return (
    <article>
      <Banner />
      <Info />
      <Skills />
      <Project />
      <Career />
    </article>
  );
}
