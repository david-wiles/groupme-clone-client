import BaseLayout from "./BaseLayout";
import RoomList from "../components/RoomList";

export default function Default() {
  return (
    <BaseLayout title={"GroupMe Clone"}>
      <RoomList/>
    </BaseLayout>
  );
}
