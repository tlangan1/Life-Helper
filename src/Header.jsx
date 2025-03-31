/** @jsxImportSource solid-js */
import { useGlobalState } from "./GlobalStateProvider";
import { createEffect, createSignal } from "solid-js";
import { AccountMenu } from "./AccountMenu";
import { OptionsMenu } from "./OptionsMenu";

import { fetchUserElapsedDailyWorkTime } from "./JS/helperFunctions.js";

export function Header(props) {
  var { user, loggedIn, setItemType, dataSource, itemsView } = useGlobalState();
  var [isProduction, setIsProduction] = createSignal();
  var [userWorking, setUserWorking] = createSignal(user().user_working);
  createEffect(() =>
    setIsProduction(dataSource() == "life_helper" ? true : false)
  );

  createEffect((user) => console.log("user updated"));

  return (
    <>
      <header
        classList={{
          "not-production": !isProduction(),
        }}
      >
        <nav class="nav-using-flex">
          <a
            class="navlink"
            onClick={() =>
              itemsView() == "my-tasks-view"
                ? setItemType("task")
                : setItemType("objective")
            }
            href={itemsView()}
          >
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
              <img src="/account.svg" />
              <Show when={loggedIn()}>
                <span>{user().display_name}</span>
                <div
                  classList={{ "working-indicator": true, hidden: !loggedIn() }}
                  title={
                    user().user_working
                      ? "You are currently working on a task"
                      : "You are NOT currently working on a task"
                  }
                  onClick={() =>
                    fetchUserElapsedDailyWorkTime(user().user_login_id)
                  }
                >
                  <img
                    src="working.svg"
                    // onClick={take the user to the task they are working on}
                    alt="Working"
                  ></img>
                  <svg
                    width="1.5rem"
                    height="1.5rem"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    classList={{ hidden: user().user_working }}
                  >
                    <line
                      x1="10"
                      y1="10"
                      x2="90"
                      y2="90"
                      stroke="red"
                      stroke-width="10"
                    />
                    <line
                      x1="10"
                      y1="90"
                      x2="90"
                      y2="10"
                      stroke="red"
                      stroke-width="10"
                    />
                  </svg>{" "}
                  <div>{user().elapsed_work_time.toFixed(2)} hours</div>
                </div>
              </Show>
            </a>
            <AccountMenu />
          </div>
        </nav>
      </header>
      {props.children}
    </>
  );
}
