import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
  return (
    <footer className="flex justify-center items-center gap-8 p-5 flex-col h-footer bg-black text-white">
      <a className="w-12 h-12" href="https://github.com/dannyp0930" target="_blank">
        <FontAwesomeIcon className="w-full h-full" icon={faGithub} />
      </a>
      <h5>© 2024. Park Sang Hun. All rights reserved.</h5>
    </footer>
  );
}
