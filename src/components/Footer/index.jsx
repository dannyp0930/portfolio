import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="link-container">
        <a href="https://github.com/dannyp0930" target="_blank">
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
      <h1>© 2024. Park Sang Hun. All rights reserved.</h1>
    </footer>
  );
}
