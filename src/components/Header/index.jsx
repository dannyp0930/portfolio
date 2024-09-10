import React from "react";

export default function Header() {
  return (
    <header className="w-dvw fixed top-0 left-0 z-50 h-header underline-offset-4 font-bold text-white">
      <nav className="w-full h-full px-5 flex justify-between items-center md:px-12">
        <a className="font-parisienne text-3xl md:text-4xl lg:text-5xl" href="#banner">SH
          <span className="hidden md:inline">&nbsp;Portfolio</span></a>
        <ul className="hidden md:flex items-center gap-5 text-2xl">
          <li><a className="hover:underline" href="#info">Info</a></li>
          <li><a className="hover:underline" href="#skills">Skills</a></li>
          <li><a className="hover:underline" href="#project">Project</a></li>
        </ul>
      </nav>
    </header>
  );
}
