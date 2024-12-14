import { Show, For, createResource } from "solid-js";
import { ProjectItem } from "./ProjectItem.jsx";
import { useGlobalState } from "./GlobalStateProvider";

import { startedButNotCompletedCount, completedCount } from "./helperFunctions";

export function ListItems(props) {
  // Remember props contains the setParent and parent signals.

  // *** The SolidJS resource items is used to store the objectives, goals or tasks
  // *** retrieved from the server depending on the context.
  var { itemType, toggleRefreshData, refreshData, dataServer } =
    useGlobalState();
  const [items, { mutate, refetch }] = createResource(refreshData, fetchItems);
  //   var fetchCount = 0;

  // TODO 1: Figure out how to allow for granular update of individual items

  return (
    <div>
      <span>{items.loading && "Loading..."}</span>
      <span>{items.error && "Error"}</span>
      {items.state == "ready" && (
        <Show when={items().length > 0}>
          <div class="item-list">
            <For each={items()}>
              {(item) =>
                ProjectItem(props, item, props.setParent, props.parent)
              }
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
      {/* <button onClick={() => toggleRefreshData()}>Sort</button> */}
      <button
        onClick={() => {
          const newItems = items();
          newItems.sort((a, b) => a.item_id - b.item_id);
          mutate(newItems);
          refetch(newItems);
          //   A comment
        }}
      >
        Sort
      </button>
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItems(source, { value, refetching }) {
    if (refetching) {
      return refetching;
    }
    var searchParams = "";
    if (itemType() != "objective")
      searchParams = JSON.stringify({
        parent_id: props.parent()[props.parent().length - 1].item_id,
      });

    var response = await fetch(
      dataServer + `/${itemType()}s` + "?params=" + searchParams
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      return await response.json();
    }
  }
}
