import {useClient} from "../hooks/useClient";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useRooms} from "../hooks/useRooms";

export default function RoomList() {
  const {courier} = useClient();
  const {rooms, setRooms} = useRooms();

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    courier.fetchRooms().then(resp => setRooms(resp.rooms));
  }, []);

  return (
    <>
      <div className={"room-ops"}>
        <input id={"search-filter"}
               placeholder={"filter"}
               type={"search"}
               name={"room-filter-input"}
               onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <nav>
        <ul>
          <li>
            <Link to={"/room/new"}>+ Create New</Link>
          </li>
          {
            rooms
              .filter((room) => room.name.toLowerCase().includes(filter.toLowerCase()))
              .map((room) => {
              return (
                <li key={room.id}>
                  <Link to={`/room/${room.id}`}>{room.name}</Link>
                </li>
              )
            })
          }
        </ul>
      </nav>
    </>
  );
}
