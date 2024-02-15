import React, { useEffect } from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import "styles/index.sass";
import Home from "pages/home";
import Project from "pages/project";

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

function App() {
  const location = useLocation();

  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
  }, []);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
      </Routes>
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;
