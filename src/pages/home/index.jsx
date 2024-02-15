import Banner from "components/pages/home/Banner";
import Career from "components/pages/home/Career";
import Info from "components/pages/home/Info";
import Skills from "components/pages/home/Skills";
import React from "react";

export default function Home() {
  return (
    <article>
      <Banner />
      <Info />
      <Skills />
      <Career />
    </article>
  );
}
