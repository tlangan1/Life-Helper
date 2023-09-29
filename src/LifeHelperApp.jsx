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
  var [parent, setParent] = createSignal();
  var [pageTitle, setPageTitle] = createSignal("");

  createEffect(pageTitleEffect);

  function pageTitleEffect() {
    switch (props.type) {
      case "objective":
        setPageTitle("Overall Objectives");
        break;
      case "goal":
        setPageTitle(`Goals to achieve objective ${parent().item_name}`);
        break;
      case "task":
        break;
      default:
        setPageTitle("Unknown Page Item");
    }
  }

  const fetchItems = async () => {
    var response = await fetch(dataServer + `/get/${props.type}s`);
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
        item.item_id = parent().item_id;
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

  return (
    <section class="app">
      <header class="header">
        <h1>{pageTitle()}</h1>
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
                    setParent({
                      item_id: parentLi.attributes.item_id.value,
                      item_name: parentLi.attributes.item_name.value,
                    });
                    if (props.type == "objective") props.setter("goal");
                    else if (props.type == "goal") props.setter("task");
                    setRefreshData((refreshData() + 1) % 2);
                  }}
                >
                  <div class="view">
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
                  </div>
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
