import "./LifeHelperApp.css";
import {
  askPermissionAndRegisterServiceIfAppropriate,
  sendMessage,
} from "./index.js";

import {
  Show,
  For,
  createSignal,
  createResource,
  createEffect,
} from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

import { itemFromImport } from "./objective-goal-task.jsx";
import {
  affectItem,
  startedButNotCompletedCount,
  completedCount,
} from "./helperFunctions";

function LifeHelperApp(props) {
  // *** dataServer is the URL of the server that provides the data.
  var [, , dataServer] = useGlobalState();

  // *** refreshData is a signal that is used to initiate a data refresh
  // *** using the function fetchItems.
  // *** setRefreshData is used to toggle refreshData between 0 and 1.
  var [refreshData, setRefreshData] = createSignal(0);
  const [items] = createResource(refreshData, fetchItems);

  // *** parent contains an array of at most two objects.
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
        <p>refreshData() is {refreshData()}</p>
        <p>props.type is {props.type}</p>
        <button
          class="subscription-button"
          onClick={(e) => askPermissionAndRegisterServiceIfAppropriate(e)}
        >
          Request A Web Push Subscription
        </button>
        <button class="subscription-button" onClick={(e) => sendMessage(e)}>
          Send Message To Service Worker
        </button>
        <div class="header-title">
          <h1 class={`${props.type}_header`}>{pageTitle()}</h1>
          <button
            class={`return ${visibleClassValue()}`}
            onClick={returnToParent}
          ></button>
        </div>
        <input
          class="new-item"
          onChange={(e) => {
            affectItem(
              e,
              "add",
              parent().length == 0 ? 0 : parent()[parent().length - 1].item_id,
              props.type,
              dataServer,
              refreshData,
              setRefreshData
            );
          }}
          placeholder={`Enter ${props.type}`}
          autofocus={true}
        />
      </header>
      <span>{items.loading && "Loading..."}</span>
      <span>{items.error && "Error"}</span>
      {items.state == "ready" && (
        <Show when={items().length > 0}>
          <ul class="item-list">
            <For each={items()}>
              {(item) =>
                itemFromImport(
                  item,
                  props,
                  setParent,
                  parent,
                  setRefreshData,
                  refreshData,
                  dataServer
                )
              }
            </For>
          </ul>
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
    if (props.type != "objective")
      searchParams = JSON.stringify({
        parent_id: parent()[parent().length - 1].item_id,
      });

    var response = await fetch(
      dataServer + `/${props.type}s` + "?params=" + searchParams
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
    switch (props.type) {
      case "objective":
        break;
      case "goal":
        props.setter("objective");
        setRefreshData((refreshData() + 1) % 2);
        break;
      case "task":
        props.setter("goal");
        setRefreshData((refreshData() + 1) % 2);
        break;
    }
  }

  function pageTitleEffect() {
    switch (props.type) {
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
