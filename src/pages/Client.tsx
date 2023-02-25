import CourierClient from "../CourierClient";
import Chat from "../components/Chat";
import {useContext, useState} from "react";
import {AppContext} from "../App";
import Sidebar from "../components/Sidebar";

interface ClientProps {
  courierClient?: CourierClient
}

export default function Client(props: ClientProps) {
  const state = useContext(AppContext);

  const [openRoomId, setOpenRoomId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar isSidebarOpen={isSidebarOpen}
               setIsSidebarOpen={setIsSidebarOpen}
               onSelect={(id: string) => console.log(id)}
      />
      <Chat room={openRoomId}
            client={state.courierClient}
            isSidebarOpen={isSidebarOpen}
      />
    </div>
  )
}
