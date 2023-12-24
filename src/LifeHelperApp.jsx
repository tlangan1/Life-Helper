import "./LifeHelperApp.css";

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
  var [refreshData, setRefreshData] = createSignal(0);
  var [, , dataServer] = useGlobalState();
  // parent contains an array of at most two objects.
  // 1) If the current view is the list of objectives then the array is empty.
  // 2) If the current view is a list of goals, then the array contains
  //    one object that identifies the objective with which they are associated.
  // 3) If the current view is a list of tasks, then the array contains two objects.
  //    The last object contains the goal to which they are associated
  //    and the first object contains the objective to which the goal in the last object is associated.
  var [parent, setParent] = createSignal([]);
  var [pageTitle, setPageTitle] = createSignal("");
  var [visibleClassValue, setVisibleClassValue] = createSignal("");

  createEffect(pageTitleEffect);

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

  const fetchItems = async () => {
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
  };

  const [items] = createResource(refreshData, fetchItems);

  //   var startedCount = createMemo(
  //     items().reduce((item, totalStarted) => {
  //       if (item.started_dtm) totalStarted++;
  //     })
  //   );

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

  return (
    <section class="app">
      <header>
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
}

export default LifeHelperApp;
