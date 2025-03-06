/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";
import { createSignal } from "solid-js";
import { AccountMenu } from "./AccountMenu";
import { OptionsMenu } from "./OptionsMenu";

export function Header(props) {
  var { user, setItemType, dataServer } = useGlobalState();
  var [isProduction, setIsProduction] = createSignal(false);
  fetchIsProduction();
  return (
    <>
      <header
        classList={{
          "not-production": !isProduction(),
        }}
      >
        <nav class="nav-using-flex">
          <a class="navlink" onClick={() => setItemType("objective")} href="/">
            <img src="/home.svg" />
            <span>Life Helper</span>
          </a>
          <div class="menu-container">
            <a class="navlink" href="/filters">
              <span>Options</span>
            </a>
            <OptionsMenu />
          </div>
          <div class="menu-container">
            <a class="navlink" href="/account">
              <img src="/account.svg" /> <span>{user().display_name}</span>
            </a>
            <AccountMenu />
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
