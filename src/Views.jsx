import { createSignal } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

export function Views(props) {
  var { itemsView, setItemsView, setItemType } = useGlobalState();
  return (
    <div class="route">
      <div class="label-left-wrapper">
        <h2>Select a view</h2>
        <div class="control">
          <label for="default">Default View</label>
          <input
            type="radio"
            id="default"
            name="view-type"
            value="default-view"
            checked={itemsView() == "default-view"}
            onChange={() => {
              setItemsView("default-view");
              setItemType("objective");
            }}
          />
        </div>
        <div class="control">
          <label for="my-tasks">My Tasks View</label>
          <input
            type="radio"
            id="my-tasks"
            name="view-type"
            value="/my-tasks-view"
            checked={itemsView() == "my-tasks-view"}
            onChange={() => {
              setItemsView("my-tasks-view");
              setItemType("task");
            }}
          />
        </div>
        <a href={itemsView()}>
          <button class="action-button">Apply</button>
        </a>
      </div>
    </div>
  );
}
