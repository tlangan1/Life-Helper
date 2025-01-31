/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";
import { createSignal, Show } from "solid-js";
import { AccountMenu } from "./AccountMenu";

export function Header(props) {
  var { user, setItemType } = useGlobalState();
  var [accountMenu, setAccountMenu] = createSignal(false);
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
          <div>
            <a
              class="navlink"
              id="linkAccount"
              href="/account"
              onPointerEnter={() => setAccountMenu(true)}
            >
              <img src="/account.svg" /> {user().display_name}
            </a>
            <Show when={accountMenu()}>
              <AccountMenu setAccountMenu={setAccountMenu} />
            </Show>
          </div>
        </nav>
      </header>
      {props.children}
    </>
  );
}
