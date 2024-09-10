import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <a className="home hidden md:block" href="#banner">SH Portfolio</a>
        <a className="home md:hidden" href="#banner">SH</a>
        <ul className="hidden md:flex">
          <li><a href="#info">Info</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#project">Project</a></li>
        </ul>
      </nav>
    </header>
  );
}
