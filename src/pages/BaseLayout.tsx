import {ProtectedRoute} from "../components/ProtectedRoute";
import RoomList from "../components/RoomList";

interface LayoutProps {
  title: string
}

// @ts-ignore
export default function BaseLayout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <ProtectedRoute>
      <div className={"app-container"}>
        <div id="sidebar" className={"room-list"}>
          <RoomList/>
        </div>
        <div id="detail">
          {props.children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
