import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <NavLink className="desktop-tablet home" to="/">SH Portfolio</NavLink>
        <NavLink className="mobile home" to="/">SH</NavLink>
        <ul className="desktop-tablet">
          <li><NavLink to="/content">Content</NavLink></li>
          <li><NavLink to="/content">Content</NavLink></li>
          <li><NavLink to="/content">Content</NavLink></li>
          <li><NavLink to="/content">Content</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}