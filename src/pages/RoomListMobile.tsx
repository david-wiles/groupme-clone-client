import DefaultRoom from "../components/DefaultRoom";
import BaseLayout from "./BaseLayout";
import RoomList from "../components/RoomList";

export default function RoomListMobile() {
  return (
    <BaseLayout title={"GroupMe Clone"}>
      <div className={"desktop-only"}>
        <DefaultRoom/>
      </div>
      <div className={"mobile-only room-list"}>
        <RoomList/>
      </div>
    </BaseLayout>
  );
}
