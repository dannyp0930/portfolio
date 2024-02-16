import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Banner from "components/pages/home/Banner";
import Career from "components/pages/home/Career";
import Info from "components/pages/home/Info";
import Skills from "components/pages/home/Skills";

export default function Home() {
  const [hash, setHash] = useState(1);
  const [initialY, setInitialY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function scrollEvent(e) {
      const deltaY = e.deltaY;
      if (deltaY > 0 && hash < 4) {
        navigate({ hash: `#${hash + 1}` });
      } else if (deltaY < 0 && hash > 1) {
        navigate({ hash: `#${hash - 1}` });
      }
    }

    function keydownEvent(e) {
      const keyCode = e.keyCode;
      if (keyCode === 40 && hash < 4) {
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
      if (dir && hash < 4) {
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
  }, [hash, initialY]);

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
        <section className="section-1"><Banner /></section>
        <section className="section-2"><Info /></section>
        <section className="section-3"><Skills /></section>
        <section className="section-4"><Career /></section>
      </article>
    </main>
  );
}
