import Form, {FormRequestInput} from "../components/Form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {RoomResponse} from "../client/messages";
import {useClient} from "../hooks/useClient";
import {useRooms} from "../hooks/useRooms";
import BaseLayout from "./BaseLayout";

export default function NewRoom() {
  const navigate = useNavigate();

  const {courier} = useClient();
  const {addRoom} = useRooms();
  const [name, setName] = useState<string>("");

  const afterSubmit = async (resp: RoomResponse) => {
    addRoom(resp);
    navigate(`/room/${resp.id}`);
  };

  return (
    <BaseLayout title={"Create Room"}>
      <h1>
        Create a New Room
      </h1>
      <Form id={"new-room"}
            className={"full-page new-room-form"}
            action={"/room"}
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
            submit={(form: FormRequestInput) => courier.rooms.create(form["name"])}
            afterSubmit={afterSubmit}
      />
    </BaseLayout>
  )
}
