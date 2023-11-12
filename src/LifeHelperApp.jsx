import "./LifeHelperApp.css";

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
  var [refreshData, setRefreshData] = createSignal(0);
  var [, , dataServer] = useGlobalState();
  // parent contains an object that represents the parent of the selected item
  // for an objective it is the default as shown below
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
              {(item) => (
                <li
                  class="item"
                  item_id={item.item_id}
                  item_name={item.item_name}
                  onDblClick={(e) => {
                    if (props.type == "task") return;

                    var parentLi = FindParentElement(e.target, "li");
                    setParent(() => {
                      parent().push({
                        item_id: parentLi.attributes.item_id.value,
                        item_name: parentLi.attributes.item_name.value,
                      });

                      return parent();
                    });
                    if (props.type == "objective") props.setter("goal");
                    else if (props.type == "goal") props.setter("task");
                    setRefreshData((refreshData() + 1) % 2);
                  }}
                >
                  {/* <div class="view"> */}
                  {props.type == "task" ? (
                    <input type="checkbox" class="toggle"></input>
                  ) : (
                    <input type="checkbox" class="toggle" disabled></input>
                  )}
                  <label>{item.item_name}</label>
                  <button
                    class="destroy"
                    onClick={(e) => affectItem(e, "delete")}
                  />
                  {/* </div> */}
                </li>
              )}
            </For>
          </ul>
        </Show>
      )}
    </section>
  );
}

export default LifeHelperApp;
