import {ProtectedRoute} from "../components/ProtectedRoute";
import RoomList from "../components/RoomList";
import MobileNav from "../components/MobileNav";

// @ts-ignore
export default function BaseLayout({children}) {
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
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
