import { Show, For, createResource, createEffect } from "solid-js";
import { ProjectItem } from "./ProjectItem.jsx";
import { useGlobalState } from "./GlobalStateProvider.jsx";

import {
  logToConsole,
  startedButNotCompletedCount,
  completedCount,
  isolateItem,
} from "./JS/helperFunctions.js";
import { webPushList } from "./JS/index.js";

export function ProjectItemsList(props) {
  // *** The SolidJS resource items is used to store the objectives, goals or tasks
  // *** retrieved from the server depending on the context.
  var {
    itemType,
    setItemType,
    refreshData,
    dataServer,
    filters,
    user,
    itemsView,
  } = useGlobalState();
  const [items, { mutate, refetch }] = createResource(refreshData, fetchItems);

  logToConsole(`In ProjectItemsList rendering items of type '${itemType()}'`);

  createEffect(() => {
    if (itemType() == "task") {
      var pushedItem = webPushList()[webPushList().length - 1];
      if (pushedItem == undefined) return;
      console.log(`pushedItem is ${JSON.stringify(pushedItem)}`);
      var task = isolateItem(items, pushedItem);
      console.log(JSON.stringify(task));
    }
  });

  return (
    <div class="item-list-container">
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
      </footer>
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItems(source, { value, refetching }) {
    console.log(`Fetching data with user ${user().user_login_id}`);
    if (refetching) {
      return value;
    }

    // var searchParams = { sort: filters().sort, order: filters().order };
    var searchParams = {};

    if (itemsView() == "my-tasks-view") {
      searchParams.assigned_to = user().user_login_id;
      searchParams.view = itemsView();
      setItemType("task");
    } else {
      searchParams.parent_id =
        itemType() == "objective"
          ? 0
          : props.parent()[props.parent().length - 1].item_id;
    }

    delete filters().assigned_to_me;
    searchParams = { ...searchParams, ...filters() };

    var response = await fetch(
      dataServer +
        `/get_items/${itemType()}s` +
        "?params=" +
        JSON.stringify(searchParams)
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
