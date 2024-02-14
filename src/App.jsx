import React, { useEffect } from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "styles/index.sass";
import Home from "pages/home";
import Project from "pages/project";

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
  }, []);

  return (
    <div className="app">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Project />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
