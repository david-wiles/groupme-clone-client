import React from "react";

import "./Sidebar.scss"
import {RoomResponse} from "../CourierClient";

interface SidebarProps {
  rooms: Array<RoomResponse>
  onSelect: (id: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar(props: SidebarProps) {
  return (
    <header>
      <span className={props.isSidebarOpen ? "hamburger open" : "hamburger"}
            onClick={() => props.setIsSidebarOpen((isOpen) => !isOpen)}>
        <i className="gg-menu"></i>
      </span>
      <ul className={props.isSidebarOpen ? "sidebar open" : "sidebar"}>
        {
          props.rooms.map((room) => {
            return (
              <li className={"noBullet roomSelect"} key={room.id}>
                <button>
                  <span>
                    {room.name}
                  </span>
                </button>
              </li>
            )
          })
        }
      </ul>
    </header>
  )
}