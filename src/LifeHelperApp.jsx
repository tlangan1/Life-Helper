/** @jsxImportSource solid-js */

import "./CSS/LifeHelperApp.css";

import { createSignal, createEffect, Switch } from "solid-js";
import { useParams } from "@solidjs/router";

import { useGlobalState } from "./GlobalStateProvider";

import { AddItem } from "./AddItem.jsx";

import { ProjectItemsList } from "./ProjectItemsList.jsx";
import { WebPushList } from "./WebPushList";

import "./CSS/context-menu.css";

import { login, setupContextMenu } from "./JS/helperFunctions";

export function LifeHelperApp(props) {
  //   setupContextMenu();
  var {
    itemType,
    setItemType,
    parent,
    setParent,
    refreshData,
    toggleRefreshData,
    itemsView,
    setItemsView,
    setUser,
    loggedIn,
    filters,
    dataServer,
  } = useGlobalState();

  if (!loggedIn()) requestCredentials();

  var { viewType } = useParams();
  if (!viewType) {
    setItemsView("/");
  }

  //   createEffect(pageTitleEffect);
  createEffect(() => (itemsView() == "/" ? pageTitleEffect() : null));

  var [pageTitle, setPageTitle] = createSignal("");

  // *** visibleClassValue is a signal that is used to toggle the visibility of the return button.
  var [visibleClassValue, setVisibleClassValue] = createSignal("");

  return (
    <section class="route">
      <header class="life-helper-header">
        <Switch>
          <Match when={itemsView() == "/"}>
            {" "}
            <div class="header-title">
              <h1 class={`${itemType()}_header`}>{pageTitle()}</h1>
              <button
                class={`return ${visibleClassValue()}`}
                onClick={returnToParent}
              ></button>
            </div>
            <AddItem parent={parent} />
          </Match>
          <Match when={itemsView() == "my-tasks-view"}>
            {" "}
            <div class="header-title">
              <h1 class={`${itemType()}_header`}>Tasks Assigned To You</h1>
            </div>
          </Match>
        </Switch>
      </header>
      <ProjectItemsList setParent={setParent} parent={parent} />
      <WebPushList />
    </section>
  );

  // *** Helper functions for the code above
  function returnToParent() {
    setParent(() => {
      parent().pop();
      return parent();
    });
    switch (itemType()) {
      case "objective":
        break;
      case "goal":
        setItemType("objective");
        toggleRefreshData();
        break;
      case "task":
        setItemType("goal");
        toggleRefreshData();
        break;
    }
  }

  function pageTitleEffect() {
    if (itemType() == "my-tasks-view") {
      setPageTitle("Tasks Assigned To You");
    } else {
      switch (itemType()) {
        case "objective":
          setPageTitle("Overall Objectives");
          setVisibleClassValue("");
          break;
        case "goal":
          setPageTitle(
            `Goals to achieve objective "${
              parent()[parent().length - 1].item_name
            }"`
          );
          setVisibleClassValue("visible");
          break;
        case "task":
          setPageTitle(
            itemsView() == "my-tasks-view"
              ? "Your tasks"
              : `Tasks to achieve goal "${
                  parent()[parent().length - 1].item_name
                }"`
          );
          setVisibleClassValue("visible");

          break;
        default:
          setPageTitle("Unknown Page Item");
      }
    }
  }

  async function requestCredentials() {
    if (navigator.credentials) {
      try {
        var credentials = await navigator.credentials.get({
          password: true,
          mediation: "silent",
        });

        if (credentials) {
          console.log(
            `Auto login of type ${credentials.type} for user ${credentials.id}`
          );
          // Use the credentials to log the user in
          await login(
            {
              user_name: credentials.id,
              password: credentials.password,
            },
            setUser,
            dataServer
          );
          console.log("calling toggleRefreshData()");
          console.log(`refreshData before toggle: ${refreshData()}`);
          toggleRefreshData();
          console.log(`refreshData after toggle: ${refreshData()}`);
        }
      } catch (err) {
        console.error("Could not retrieve credentials", err);
      }
    }
  }
}

export default LifeHelperApp;
