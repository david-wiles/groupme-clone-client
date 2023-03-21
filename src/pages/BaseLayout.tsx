import {ProtectedRoute} from "../components/ProtectedRoute";
import ActionList from "../components/ActionList";

interface LayoutProps {
  title: string
}

// @ts-ignore
export default function BaseLayout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <ProtectedRoute>
      <div className={"app-container"}>
        <ActionList/>
        <div id="detail">
          {props.children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
