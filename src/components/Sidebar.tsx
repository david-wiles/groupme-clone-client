import React, {useEffect} from "react";

import "./Sidebar.scss"

interface SidebarProps {
  onSelect: (id: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar(props: SidebarProps) {

  useEffect(() => {
    // Get rooms, register with courier client
  });

  return (
    <header>
      <span className={props.isSidebarOpen ? "hamburger open" : "hamburger"}
            onClick={() => props.setIsSidebarOpen((isOpen) => !isOpen)}>
        <i className="gg-menu"></i>
      </span>
      <ul className={props.isSidebarOpen ? "sidebar open" : "sidebar"}>
        <li className={"noBullet roomSelect"}>
          <button>
            <span>
              Room 1
            </span>
          </button>
        </li>
        <li className={"noBullet roomSelect"}>
          <button>
            <span>
              Room 2
            </span>
          </button>
        </li>
        <li className={"noBullet roomSelect"}>
          <button>
            <span>
              Room 3
            </span>
          </button>
        </li>
      </ul>
    </header>
  )
}