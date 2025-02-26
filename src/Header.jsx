/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";
import { createSignal, Show } from "solid-js";
import { AccountMenu } from "./AccountMenu";

export function Header(props) {
  var { user, setItemType, dataServer } = useGlobalState();
  var [accountMenu, setAccountMenu] = createSignal(false);
  var [isProduction, setIsProduction] = createSignal(false);
  fetchIsProduction();
  return (
    <>
      <header
        classList={{
          "not-production": !isProduction(),
        }}
      >
        <nav
          classList={{
            "nav-using-flex": true,
          }}
        >
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

  async function fetchIsProduction() {
    var response = await fetch(
      dataServer + `/isProduction` // *** The route to check if the server is in production
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      var data = await response.json();
      setIsProduction(data.isProduction);
    }
  }
}
