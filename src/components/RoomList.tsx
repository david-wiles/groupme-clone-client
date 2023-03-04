import {useClient} from "../hooks/useClient";
import {useEffect, useState} from "react";
import {RoomResponse} from "../client/messages";
import {Link} from "react-router-dom";

export default function RoomList() {
  const {courier} = useClient();

  const [rooms, setRooms] = useState<Array<RoomResponse>>([]);

  useEffect(() => {
    courier.fetchRooms().then(resp => setRooms(resp.rooms));
  }, []);

  return (
    <nav>
      <ul>
        {
          rooms.map((room) => {
            return (
              <li key={room.id}>
                <Link to={`/room/${room.id}`}>{room.name}</Link>
              </li>
            )
          })
        }
      </ul>
    </nav>
  );
}
