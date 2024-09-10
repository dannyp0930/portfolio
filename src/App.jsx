import React, { useEffect } from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import "styles/index.sass";
import Home from "pages/home";

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
      <main className="min-w-80">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
