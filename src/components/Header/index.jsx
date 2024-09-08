import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <a className="desktop-tablet home" href="#banner">SH Portfolio</a>
        <a className="mobile home" href="#banner">SH</a>
        <ul className="desktop-tablet">
          <li><a href="#info">Info</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#project">Project</a></li>
        </ul>
      </nav>
    </header>
  );
}
