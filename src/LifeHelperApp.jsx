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

import { startedButNotCompletedCount, completedCount } from "./helperFunctions";

function LifeHelperApp(props) {
  registerServiceWorker();
  // *** dataServer is the URL of the server that provides the data.
  var [, , refreshData, toggleRefreshData, dataServer] = useGlobalState();

  // *** The SolidJS resource items is used to store the objectives, goals or tasks
  // *** retrieved from the server depending on the context.
  const [items] = createResource(refreshData, fetchItems);

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
    <section class="app">
      <header>
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
          <h1 class={`${props.itemType}_header`}>{pageTitle()}</h1>
          <button
            class={`return ${visibleClassValue()}`}
            onClick={returnToParent}
          ></button>
        </div>
        <AddItem
          parent_id={
            parent().length == 0 ? 0 : parent()[parent().length - 1].item_id
          }
          item_type={props.itemType}
          dataServer={dataServer}
        />
      </header>
      <span>{items.loading && "Loading..."}</span>
      <span>{items.error && "Error"}</span>
      {items.state == "ready" && (
        <Show when={items().length > 0}>
          <div class="item-list">
            <For each={items()}>
              {(item) => ProjectItem(props, item, setParent, parent)}
            </For>
          </div>
        </Show>
      )}
      <footer>
        <span>{`Total items: ${
          items.state == "ready" && items().length
        }`}</span>
        <span>{`Started but not completed items: ${
          items.state == "ready" && startedButNotCompletedCount(items)
        }`}</span>
        <span>{`Completed items: ${
          items.state == "ready" && completedCount(items)
        }`}</span>
      </footer>
    </section>
  );

  // *** Helper functions for the code above
  async function fetchItems() {
    var searchParams = "";
    if (props.itemType != "objective")
      searchParams = JSON.stringify({
        parent_id: parent()[parent().length - 1].item_id,
      });

    var response = await fetch(
      dataServer + `/${props.itemType}s` + "?params=" + searchParams
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      return await response.json();
    }
  }

  function returnToParent() {
    setParent(() => {
      parent().pop();
      return parent();
    });
    switch (props.itemType) {
      case "objective":
        break;
      case "goal":
        props.setItemType("objective");
        toggleRefreshData();
        break;
      case "task":
        props.setItemType("goal");
        toggleRefreshData();
        break;
    }
  }

  function pageTitleEffect() {
    switch (props.itemType) {
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
