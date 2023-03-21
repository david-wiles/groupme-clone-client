import {Link} from "react-router-dom";
import {useState} from "react";

export default function ActionList() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="sidebar" className={"link-list"}>
      <div className={"sidebar-button"}>
        <button className={"mobile-only hamburger-container"} onClick={() => setMobileMenuOpen((o) => !o)}>
          <span id="hamburger" className={mobileMenuOpen ? "hamburger open" : "hamburger"}>
            <i className="gg-menu"></i>
          </span>
        </button>
      </div>
      <nav className={mobileMenuOpen ? "open" : "mobile-none"}>
        <ul>
          <li>
            <Link to={"/room/new"}>Create New Room</Link>
          </li>
          <li>
            <Link to={"/profile"}>My Profile</Link>
          </li>
          <li>
            <Link to={"/settings"}>Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}