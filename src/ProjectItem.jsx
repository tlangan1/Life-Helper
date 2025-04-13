import "./CSS/ProjectItem.css";

import { createSignal } from "solid-js";

import {
  childItemType,
  logToConsole,
  capitalizeFirstLetter,
} from "./JS/helperFunctions";

import { useGlobalState } from "./GlobalStateProvider";
import { ProjectItemDetail } from "./ProjectItemDetail";

export function ProjectItem(props) {
  var { mode, itemType, setItemType, toggleRefreshData } = useGlobalState();
  var [item, setItem] = createSignal(Object.assign({}, props.item));

  //   logToConsole(`In ProjectItem rendering item with name ${item().item_name}`);
  return (
    <div
      data-item_id={item().item_id}
      data-item_name={item().item_name}
      id={`project_item_{ item().item_id }`}
      onDblClick={openChildren}
    >
      <input
        type="checkbox"
        name={item().item_id}
        id={item().item_id}
        role="button"
      />
      <div class="item-header">
        <label
          for={item().item_id}
          classList={{
            completed: item().completed_dtm,
            started: item().started_dtm,
            canceled: item().aborted_dtm,
            paused: item().paused_dtm,
          }}
        >
          {item().item_name} ({item().item_id})
        </label>

        {itemType() != "task" ? (
          <button
            class="children"
            onClick={openChildren}
          >{`${capitalizeFirstLetter(childItemType(itemType()))}s`}</button>
        ) : null}
      </div>
      <ProjectItemDetail
        item={item}
        setItem={setItem}
        items={props.items}
        parent={props.parent}
      />
    </div>
  );

  // helper functions for the code above
  function openChildren(event) {
    if (itemType() == "task") return;

    props.setParent(() => {
      props.parent().push({
        item_id: item().item_id,
        item_name: item().item_name,
      });

      return props.parent();
    });

    // Before we refresh the data, we need to set the itemType to the next level.
    setItemType(childItemType(itemType()));
    toggleRefreshData();
  }
}
