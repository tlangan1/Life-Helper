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
    toggleRefreshData,
    setItemsView,
    setUser,
    loggedIn,
    filters,
    dataServer,
  } = useGlobalState();

  if (!loggedIn()) requestCredentials();

  var { viewType } = useParams();
  setItemsView(viewType);

  //   createEffect(pageTitleEffect);
  createEffect(() => (viewType == undefined ? pageTitleEffect() : null));

  var [pageTitle, setPageTitle] = createSignal("");

  // *** visibleClassValue is a signal that is used to toggle the visibility of the return button.
  var [visibleClassValue, setVisibleClassValue] = createSignal("");

  return (
    <section class="route">
      <header class="life-helper-header">
        <Switch>
          <Match when={viewType == undefined}>
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
          <Match when={viewType == "my-tasks-view"}>
            {" "}
            <div class="header-title">
              <h1 class={`${itemType()}_header`}>Tasks Assigned To You</h1>
            </div>
          </Match>
        </Switch>
      </header>
      <ProjectItemsList
        setParent={setParent}
        parent={parent}
        viewType={viewType}
      />
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
    if (viewType == "my-tasks-view") {
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
          // TODO: if this is a my-tasks-view, then make that the label.
          setPageTitle(
            filters().view == "my-tasks-view"
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

  function requestCredentials() {
    if (navigator.credentials) {
      navigator.credentials
        .get({ password: true /*, mediation: "silent" */ })
        .then((credentials) => {
          if (credentials) {
            console.log("Auto login with credentials", credentials);
            // Use the credentials to log the user in
            login(
              {
                user_name: credentials.id,
                password: credentials.password,
              },
              setUser,
              dataServer
            );
          }
        })
        .catch((err) => {
          console.error("Could not retrieve credentials", err);
        });
    }
  }
}

export default LifeHelperApp;
