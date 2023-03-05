import Form from "../components/Form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {RoomResponse} from "../client/messages";
import {useAuth} from "../hooks/useAuth";

export default function NewRoom() {

  const navigate = useNavigate();

  const {auth} = useAuth();

  const [name, setName] = useState<string>("");

  const handleResponse = async (resp: Response) => {
    if (resp.status < 300) {
      const body: RoomResponse = await resp.json();
      navigate(`/room/${body.id}`);
    }
  };

  return (
    <Form id={"new-room"}
          className={"new-room-form"}
          action={"http://localhost:9000/room"}
          method={"POST"}
          inputs={[
            {
              displayName: "name",
              name: "name",
              type: "text",
              value: name,
              setValue: setName,
            },
          ]}
          authToken={auth.token}
          afterSubmit={handleResponse}
    />
  )
}
