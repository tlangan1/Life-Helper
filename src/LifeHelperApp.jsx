/** @jsxImportSource solid-js */

import "./LifeHelperApp.css";
import {
  askWebPushPermission,
  sendMessage,
  registerServiceWorker,
} from "./index.js";

import {
  Show,
  For,
  createSignal,
  createResource,
  createEffect,
  Switch,
} from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

import { AddItem } from "./AddItem.jsx";

import { ProjectItemsList } from "./ProjectItemsList.jsx";
import { NoteList } from "./NotesList.jsx";

export function LifeHelperApp(props) {
  //   registerServiceWorker();
  // *** dataServer is the URL of the server that provides the data.
  var {
    itemType,
    setItemType,
    parent,
    setParent,
    toggleRefreshData,
    dataServer,
    listView,
  } = useGlobalState();

  // *** pageTitleEffect is a signal that is used to set the page title and
  // *** is triggered by changes to props.type.
  createEffect(pageTitleEffect);
  var [pageTitle, setPageTitle] = createSignal("");

  // *** visibleClassValue is a signal that is used to toggle the visibility of the return button.
  var [visibleClassValue, setVisibleClassValue] = createSignal("");

  return (
    <section class="route">
      <header class="life-helper-header">
        <button
          class="action-button"
          onClick={(e) =>
            registerServiceWorker({
              type: "Backend Server URL",
              backend_server_url: dataServer,
            })
          }
        >
          Request A Web Push Subscription
        </button>
        <button class="action-button" onClick={(e) => sendMessage(e)}>
          Send Message To Service Worker
        </button>
        <div class="header-title">
          <h1 class={`${itemType()}_header`}>{pageTitle()}</h1>
          <button
            class={`return ${visibleClassValue()}`}
            onClick={returnToParent}
          ></button>
        </div>
        <AddItem
          parent={parent}
          item_type={itemType()}
          dataServer={dataServer}
        />
      </header>
      <ProjectItemsList setParent={setParent} parent={parent} />
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
          `Tasks to achieve goal "${parent()[parent().length - 1].item_name}"`
        );
        setVisibleClassValue("visible");

        break;
      default:
        setPageTitle("Unknown Page Item");
    }
  }
}

export default LifeHelperApp;
