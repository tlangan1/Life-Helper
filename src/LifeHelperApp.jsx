import { Show, For, createSignal, createResource, onMount } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

function LifeHelperApp(props) {
  var [refreshData, setRefreshData] = createSignal(0);
  var [, , dataServer] = useGlobalState();

  const fetchItems = async () => {
    var response = await fetch(dataServer + `/get/${props.type}s`);
    if (!response.ok) {
      alert(
        "Server Error: status is " +
          response.status +
          " reason is " +
          response.statusText
      );
    } else {
      return await response.json();
    }
  };

  const [items] = createResource(refreshData, fetchItems);

  async function addItem(evt) {
    // body data
    const item = {
      name: evt.target.value,
      description: `This is a description of an ${props.type}`, // TODO create a description control
    };

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // send POST request
    var response = await fetch(dataServer + `/add/${props.type}`, options);

    if (!response.ok) {
      alert(
        "Server Error: status is " +
          response.status +
          " reason is " +
          response.statusText
      );
    } else {
      setRefreshData((refreshData() + 1) % 2);
      evt.target.value = "";
    }
  }

  async function deleteItem(evt) {
    // body data
    const item = {
      item_id: evt.target.attributes.item_id.value,
    };

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // send POST request
    var response = await fetch(dataServer + `/delete/${props.type}`, options);

    if (!response.ok) {
      alert(
        "Server Error: status is " +
          response.status +
          " reason is " +
          response.statusText
      );
    } else {
      setRefreshData((refreshData() + 1) % 2);
      evt.target.value = "";
    }
  }

  return (
    <section class="app">
      <header class="header">
        <h1>{props.type}s</h1>
        <input
          class="new-item"
          onChange={(e) => addItem(e)}
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
                  onDblClick={() => {
                    props.setter("goal");
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
                      item_id={item.item_id}
                      class="destroy"
                      onClick={(e) => deleteItem(e)}
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
