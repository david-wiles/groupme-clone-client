import {useLocation} from "react-router-dom";

export default function MobileNav() {
  const location = useLocation()

  return (
    <div className={"banner"}>
      <h1>Page Title</h1>
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
