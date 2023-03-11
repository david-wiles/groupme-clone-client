import {ProtectedRoute} from "../components/ProtectedRoute";
import RoomList from "../components/RoomList";
import MobileNav from "../components/MobileNav";

interface LayoutProps {
  title: string
}

// @ts-ignore
export default function BaseLayout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <ProtectedRoute>
      <div className={"app-container"}>
        <div className={"desktop-only"}>
          <div id="sidebar" className={"room-list"}>
            <RoomList/>
          </div>
        </div>
        <div className={"mobile-only"}>
          <MobileNav title={props.title}/>
        </div>
        <div id="detail">
          {props.children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
