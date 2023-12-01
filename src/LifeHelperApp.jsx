import "./LifeHelperApp.css";
import { itemFromImport } from "./objective-goal-task.jsx";

import {
  Show,
  For,
  createSignal,
  createResource,
  createEffect,
} from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

import { FindParentElement } from "./helperFunctions";

function LifeHelperApp(props) {
  //   var x = itemFromImport({ item_id: 5 });

  var [refreshData, setRefreshData] = createSignal(0);
  var [, , dataServer] = useGlobalState();
  // parent contains an array of at most two objects.
  // 1) If the current view is the list of objectives then the array is empty.
  // 2) If the current view is a list of goals, then the array contains
  //    one object that identifies the objective with which they are associated.
  // 3) If the current view is a list of tasks, then the array contains two objects.
  //    The last object contains the goals to which they are associated
  //    and the first object contains the objective to which the goal in the last object is associated.
  var [parent, setParent] = createSignal([]);
  var [pageTitle, setPageTitle] = createSignal("");

  createEffect(pageTitleEffect);

  function pageTitleEffect() {
    switch (props.type) {
      case "objective":
        setPageTitle("Overall Objectives");
        break;
      case "goal":
        setPageTitle(
          `Goals to achieve objective "${
            parent()[parent().length - 1].item_name
          }"`
        );
        break;
      case "task":
        setPageTitle(
          `Tasks to achieve goal "${parent()[parent().length - 1].item_name}"`
        );
        break;
      default:
        setPageTitle("Unknown Page Item");
    }
  }

  const fetchItems = async () => {
    // request options

    var item = {};
    if (props.type == "objective") item.item_id = 0;
    else item.item_id = parent()[parent().length - 1].item_id;

    const options = {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    };

    var response = await fetch(dataServer + `/get/${props.type}s`, options);
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      return await response.json();
    }
  };

  const [items] = createResource(refreshData, fetchItems);

  async function affectItem(evt, affectType) {
    // body data
    var item;

    switch (affectType) {
      case "add":
        item = {
          name: evt.target.value,
          description: `This is a description of an ${props.type}`, // TODO create a description control
        };
        item.item_id = parent()[parent().length - 1].item_id;
        break;
      case "update":
        item = {
          name: evt.target.value,
          item_id: evt.target.attributes.item_id.value,
          description: `This is a description of an ${props.type}`, // TODO create a description control
        };
        break;
      case "delete":
        var parentLi = FindParentElement(evt.target, "li");
        item = {
          item_id: parentLi.attributes.item_id.value,
        };
        break;
    }

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // send POST request
    var response = await fetch(
      dataServer + `/${affectType}/${props.type}`,
      options
    );

    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      setRefreshData((refreshData() + 1) % 2);
      evt.target.value = "";
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

  return (
    <section class="app">
      <header>
        <div class="header-title">
          <h1 class={`${props.type}_header`}>{pageTitle()}</h1>
          <button class="return" onClick={returnToParent}></button>
        </div>
        <input
          class="new-item"
          onChange={(e) => affectItem(e, "add")}
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
                  refreshData
                )
              }
            </For>
          </ul>
        </Show>
      )}
    </section>
  );
}

export default LifeHelperApp;
