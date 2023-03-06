import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useClient} from "../hooks/useClient";
import {useRooms} from "../hooks/useRooms";
import {RoomResponse} from "../client/messages";

export default function JoinRoom() {
  const navigate = useNavigate();
  const {courier} = useClient();
  const {id} = useParams();
  const {addRoom} = useRooms();

  const [status, setStatus] = useState<string>("Joining room...");

  useEffect(() => {
    courier.fetch("POST", `/room/${id}/join`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json()
        } else {
          setStatus("Unable to join room. Check the join link and try again.");
        }
      })
      .then((body: RoomResponse) => {
        addRoom(body)
        navigate(`/room/${id}`)
      })
  }, []);

  return (
    <div>
      <p>
        {status}
      </p>
    </div>
  );
}
