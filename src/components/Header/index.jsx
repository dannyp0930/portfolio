import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 font-bold text-white w-dvw h-header underline-offset-4">
      <nav className="flex items-center justify-between w-full h-full px-5 md:px-12">
        <a className="text-3xl font-parisienne md:text-4xl lg:text-5xl" href="#banner">SH
          <span className="hidden md:inline">&nbsp;Portfolio</span></a>
        <ul className="items-center hidden gap-5 text-2xl md:flex">
          <li><a className="hover:underline" href="#info">Info</a></li>
          <li><a className="hover:underline" href="#skills">Skills</a></li>
          <li><a className="hover:underline" href="#project">Project</a></li>
          <li><a className="hover:underline" href="#career">Career</a></li>
        </ul>
      </nav>
    </header>
  );
}
