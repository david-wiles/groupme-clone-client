import {Outlet} from "react-router-dom";
import {ProtectedRoute} from "../components/ProtectedRoute";
import RoomList from "../components/RoomList";
import MobileNav from "../components/MobileNav";

export default function Root() {
  return (
    <ProtectedRoute>
      <div className={"app-container"}>
        <div className={"desktop-only"}>
          <div id="sidebar">
            <h1>Chat Rooms</h1>
            <RoomList/>
          </div>
        </div>
        <div className={"mobile-only"}>
          <MobileNav/>
        </div>
        <div id="detail">
          <Outlet/>
        </div>
      </div>
    </ProtectedRoute>
  );
}
