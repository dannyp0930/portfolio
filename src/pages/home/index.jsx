import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Banner from "components/home/Banner";
import Project from "components/home/Project";
import Info from "components/home/Info";
import Skills from "components/home/Skills";

export default function Home() {
  const [sectionLength, setSectionLength] = useState(0);
  const [hash, setHash] = useState(1);
  const [initialY, setInitialY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    setSectionLength(sections.length);
  }, []);

  useEffect(() => {
    function scrollEvent(e) {
      const deltaY = e.deltaY;
      if (deltaY > 0 && hash < sectionLength) {
        navigate({ hash: `#${hash + 1}` });
      } else if (deltaY < 0 && hash > 1) {
        navigate({ hash: `#${hash - 1}` });
      }
    }

    function keydownEvent(e) {
      const keyCode = e.keyCode;
      if (keyCode === 40 && hash < sectionLength) {
        navigate({ hash: `#${hash + 1}` });
      } else if (keyCode === 38 && hash > 1) {
        navigate({ hash: `#${hash - 1}` });
      }
    }

    function touchStartEvent(e) {
      setInitialY(e.touches[0].clientY);
    }

    function toucMoveEvent(e) {
      const dir = initialY - e.touches[0].clientY > 0;
      if (dir && hash < sectionLength) {
        navigate({ hash: `#${hash + 1}` });
      } else if (!dir && hash > 1) {
        navigate({ hash: `#${hash - 1}` });
      }
    }

    const srcollEventFunc = debounce(scrollEvent, 500);
    const touchStartEventFunc = debounce(touchStartEvent, 100);
    const touchMoveEventFunc = debounce(toucMoveEvent, 100);
    const keydownEventFunc = debounce(keydownEvent, 300);
    window.addEventListener("wheel", srcollEventFunc);
    window.addEventListener("keydown", keydownEventFunc);
    window.addEventListener("touchstart", touchStartEventFunc);
    window.addEventListener("touchmove", touchMoveEventFunc);
    return () => {
      window.removeEventListener("wheel", srcollEventFunc);
      window.removeEventListener("keydown", keydownEventFunc);
      window.removeEventListener("touchstart", touchStartEventFunc);
      window.removeEventListener("touchmove", touchMoveEventFunc);
    };
  }, [sectionLength, hash, initialY]);

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
      <article>
        <section className="section section-1"><Banner /></section>
        <section className="section section-2"><Info /></section>
        <section className="section section-3"><Skills /></section>
        <section className="section section-4"><Project /></section>
      </article>
    </main>
  );
}
