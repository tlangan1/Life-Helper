/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";
import { createEffect, createSignal } from "solid-js";
import { AccountMenu } from "./AccountMenu";
import { OptionsMenu } from "./OptionsMenu";

export function Header(props) {
  //   var { user, setItemType, isProduction, dataServer } = useGlobalState();
  var { user, setItemType, dataSource } = useGlobalState();
  var [isProduction, setIsProduction] = createSignal();
  createEffect(() =>
    setIsProduction(dataSource() == "life_helper" ? true : false)
  );

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
}
