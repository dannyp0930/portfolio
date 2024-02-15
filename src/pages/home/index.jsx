import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "components/pages/home/Banner";
import Career from "components/pages/home/Career";
import Info from "components/pages/home/Info";
import Skills from "components/pages/home/Skills";

export default function Home() {
  const [hash, setHash] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = parseInt(location.hash.slice(1));
      setHash(hash);
    } else {
      setHash(1);
    }
  }, [location]);

  useEffect(() => {
    if (hash) {
      const section = document.querySelector(`.section-${hash}`);
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <main id="home">
      <nav className="home-nav">
        <ul>
          <li><Link className={hash === 1 ? "active" : ""} to="/#1"></Link></li>
          <li><Link className={hash === 2 ? "active" : ""} to="/#2"></Link></li>
          <li><Link className={hash === 3 ? "active" : ""} to="/#3"></Link></li>
          <li><Link className={hash === 4 ? "active" : ""} to="/#4"></Link></li>
        </ul>
      </nav>
      <article>
        <section className="section-1" ><Banner/></section>
        <section className="section-2" ><Info/></section>
        <section className="section-3" ><Skills/></section>
        <section className="section-4" ><Career/></section>
      </article>
    </main>
  );
}
