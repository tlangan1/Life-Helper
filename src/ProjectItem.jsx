import "./ProjectItem.css";

import { createSignal, createMemo } from "solid-js";

import {
  affectItem,
  childItemType,
  capitalizeFirstLetter,
} from "./helperFunctions";

import { useGlobalState } from "./GlobalStateProvider";
import { ProjectItemDetail } from "./ProjectItemDetail";

export function ProjectItem(props) {
  // *** dataServer is the URL of the server that provides the data.
  var { mode, itemType, setItemType, toggleRefreshData } = useGlobalState();
  var [item, setItem] = createSignal(Object.assign({}, props.item));

  console.log(`In ProjectItem rendering item with name ${item().item_name}`);
  return (
    <div
      data-item_id={item().item_id}
      data-item_name={item().item_name}
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
            deleted: item().deleted_dtm,
          }}
        >
          {item().item_name} ({mode == "dev" ? item().item_id : ""})
        </label>

        {itemType() != "task" ? (
          <button
            class="children"
            onClick={openChildren}
          >{`${capitalizeFirstLetter(childItemType(itemType()))}s`}</button>
        ) : null}
      </div>
      <ProjectItemDetail
        itemType={itemType}
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
