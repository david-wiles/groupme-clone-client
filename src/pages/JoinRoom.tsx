import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";

export default function JoinRoom() {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {id} = useParams();

  const [status, setStatus] = useState<string>("Joining room...");

  useEffect(() => {
    fetch(`http://localhost:9000/room/${id}/join`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + auth.token
      }
    })
      .then((resp) => {
        if (resp.ok) {
          navigate(`/room/${id}`)
        } else {
          setStatus("Unable to join room. Check the join link and try again.");
        }
      })
  });

  return (
    <div>
      <p>
        {status}
      </p>
    </div>
  );
}
