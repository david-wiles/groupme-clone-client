import {useLocation} from "react-router-dom";

interface MobileNavProps {
  title: string
}

export default function MobileNav(props: MobileNavProps) {
  const location = useLocation()

  return (
    <div className={"banner"}>
      <nav className={"mobile-nav"}>
        {
          location.pathname !== '/' ?
            // eslint-disable-next-line no-restricted-globals
            <button onClick={() => history.back()}>
              <i className={"gg-arrow-left"}></i>
              <span className={"sr-only"}>Back Arrow</span>
            </button> :
            <></>
        }
      </nav>
    </div>
  );
}
