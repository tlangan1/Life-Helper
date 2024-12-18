/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";

export function Header(props) {
  var { setItemType } = useGlobalState();
  return (
    <>
      <header>
        <nav class="nav-using-flex">
          <a
            class="navlink"
            id="linkHome"
            onClick={() => setItemType("objective")}
            href="/"
          >
            <img src="/home.svg" />{" "}
          </a>
          <h1>
            <a class="navlink" href="/filters">
              Filters
            </a>
          </h1>
          <a class="navlink" id="linkOrder" href="/account">
            <img src="/account.svg" />{" "}
          </a>
        </nav>
      </header>
      {props.children}
    </>
  );
}
