import DefaultRoom from "../components/DefaultRoom";
import BaseLayout from "./BaseLayout";

export default function Default() {
  return (
    <BaseLayout title={"GroupMe Clone"}>
      <div className={"desktop-only"}>
        <DefaultRoom/>
      </div>
    </BaseLayout>
  );
}
