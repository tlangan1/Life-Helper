import { createSignal } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

export function Views(props) {
  var { itemsView } = useGlobalState();
  var [selectedView, setSelectedView] = createSignal(itemsView());
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
            value="/"
            checked={itemsView() == undefined}
            onChange={() => setSelectedView("/")}
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
            onChange={() => setSelectedView("my-tasks-view")}
          />
        </div>
        <a href={selectedView()}>
          <button class="action-button">Apply</button>
        </a>
      </div>
    </div>
  );

  /* *** Helper functions *** */
  function setSelectedView() {
    var selectedView = document.querySelector(
      'input[name="view-type"]:checked'
    ).value;
  }

  // TODO
  // write a function that takes the event object passed to the function
  // that is assigned to onChange and sets the selectedView signal to the
  // value of the input element that is checked.
}
