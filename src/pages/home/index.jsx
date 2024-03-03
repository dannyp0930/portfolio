import React from "react";
import Banner from "components/home/Banner";
import Project from "components/home/Project";
import Info from "components/home/Info";
import Skills from "components/home/Skills";

export default function Home() {
  return (
    <main id="home">
      <article>
        <section className="section section-1"><Banner /></section>
        <section className="section section-2"><Info /></section>
        <section className="section section-3"><Skills /></section>
        <section className="section section-4"><Project /></section>
      </article>
    </main>
  );
}
