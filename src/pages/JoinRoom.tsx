import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useClient} from "../hooks/useClient";
import {useRooms} from "../hooks/useRooms";
import BaseLayout from "./BaseLayout";

export default function JoinRoom() {
  const navigate = useNavigate();
  const {courier} = useClient();
  const {id} = useParams();

  const {addRoom} = useRooms();

  const [status, setStatus] = useState<string>("Joining room...");

  useEffect(() => {
    if (id) {
      courier.rooms.join(id)
        .then((room) => {
          addRoom(room);
          navigate(`/room/${room.id}`)
        })
    }
  }, []);

  return (
    <BaseLayout title={"Join Room"}>
      <div>
        <p>
          {status}
        </p>
      </div>
    </BaseLayout>
  );
}
