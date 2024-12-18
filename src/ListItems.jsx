import { Show, For, createResource } from "solid-js";
import { ProjectItem } from "./ProjectItem.jsx";
import { useGlobalState } from "./GlobalStateProvider";

import { startedButNotCompletedCount, completedCount } from "./helperFunctions";

export function ListItems(props) {
  // Remember props contains the setParent and parent signals.

  // *** The SolidJS resource items is used to store the objectives, goals or tasks
  // *** retrieved from the server depending on the context.
  var { itemType, refreshData, dataServer, filters } = useGlobalState();
  const [items, { mutate, refetch }] = createResource(refreshData, fetchItems);

  return (
    <div>
      <span>{items.loading && "Loading..."}</span>
      <span>{items.error && "Error"}</span>
      {items.state == "ready" && (
        <Show when={items().length > 0}>
          <div class="item-list">
            <For each={items()}>
              {(item) => (
                <ProjectItem
                  item={item}
                  setParent={props.setParent}
                  parent={props.parent}
                  items={items}
                  mutate={mutate}
                  refetch={refetch}
                />
              )}
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
      <button
        class="action-button"
        onClick={() => {
          const newItems = items();
          newItems.sort((a, b) => a.item_id - b.item_id);
          mutate(newItems);
          refetch();
        }}
      >
        Sort the items in place by item_id, the number in the parentheses.
      </button>
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItems(source, { value, refetching }) {
    if (refetching) {
      return value;
    }
    var searchParams = "";
    if (itemType() != "objective")
      searchParams = JSON.stringify({
        parent_id: props.parent()[props.parent().length - 1].item_id,
        include_completed: filters().include_completed_items,
      });
    else
      searchParams = JSON.stringify({
        include_completed: filters().include_completed_items,
      });

    // alert(JSON.stringify(filters()));
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
