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
} from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

import { ProjectItem } from "./ProjectItem.jsx";
import { AddItem } from "./AddItem.jsx";

import { ListItems } from "./ListItems.jsx";

function LifeHelperApp(props) {
  registerServiceWorker();
  // *** dataServer is the URL of the server that provides the data.
  var { itemType, setItemType, refreshData, toggleRefreshData, dataServer } =
    useGlobalState();

  // *** parent contains an array of at most two objects.
  // *** It is essentially a stack that is used to navigate the hierarchy of objectives, goals and tasks.
  // *** Each object contains two properties: item_id and item_name.
  // *** 1) If the current view is the list of objectives then the array is empty.
  // *** 2) If the current view is a list of goals, then the array contains
  // ***    one object that identifies the objective with which the goals are associated.
  // *** 3) If the current view is a list of tasks, then the array contains two objects.
  // ***    The second object contains the goal to which the tasks are associated
  // ***    and the first object contains the objective to which that goal is associated.
  var [parent, setParent] = createSignal([]);

  // *** pageTitleEffect is a signal that is used to set the page title and
  // *** is triggered by changes to props.type.
  createEffect(pageTitleEffect);
  var [pageTitle, setPageTitle] = createSignal("");

  // *** visibleClassValue is a signal that is used to toggle the visibility of the return button.
  var [visibleClassValue, setVisibleClassValue] = createSignal("");

  return (
    <section class="life-helper-route">
      <header class="life-helper-header">
        {/* <p>refreshData() is {refreshData()}</p> */}
        {/* <p>props.type is {props.type}</p> */}
        <button
          class="subscription-button"
          disabled
          onClick={(e) =>
            askWebPushPermission({
              type: "Backend Server URL",
              backend_server_url: dataServer,
            })
          }
        >
          Request A Web Push Subscription
        </button>
        <button class="subscription-button" onClick={(e) => sendMessage(e)}>
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
          //   parent_id={
          //     parent().length == 0 ? 0 : parent()[parent().length - 1].item_id
          //   }
          parent={parent}
          item_type={itemType()}
          dataServer={dataServer}
        />
      </header>
      <ListItems setParent={setParent} parent={parent} />
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
