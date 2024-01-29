import React from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "styles/index.sass";
import Home from "pages/home";
import Content from "pages/content";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content" element={<Content />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
