import {RoomResponse} from "../CourierClient";
import ChatRoom from "../components/ChatRoom";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../App";
import Sidebar from "../components/Sidebar";

interface ClientProps {
}

export default function Client(props: ClientProps) {
  const {courierClient} = useContext(GlobalContext);

  const [activeRoomId, setActiveRoomId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rooms, setRooms] = useState(new Array<RoomResponse>());

  useEffect(() => {
    // Get rooms, register with courier client
    courierClient?.fetchRooms().then(rooms => setRooms(rooms.rooms))
  }, [courierClient]);

  return (
    <div>
      <Sidebar isSidebarOpen={isSidebarOpen}
               setIsSidebarOpen={setIsSidebarOpen}
               onSelect={(id: string) => console.log(id)}
               rooms={rooms}
      />
      {
        rooms.map((room) => {
          const isHidden = room.id !== activeRoomId || isSidebarOpen;
          return (
            <ChatRoom roomId={room.id}
                      isHidden={isHidden}
                      key={room.id}
            />
          )
        })
      }
    </div>
  )
}
