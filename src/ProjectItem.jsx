import "./ProjectItem.css";

import { createSignal } from "solid-js";

import {
  affectItem,
  childItemType,
  capitalizeFirstLetter,
} from "./helperFunctions";

import { useGlobalState } from "./GlobalStateProvider";
import { ProjectItemDetail } from "./ProjectItemDetail";

export function ProjectItem(
  props /* used in LifeHelperApp */,
  item /* used in LifeHelperApp */,
  setParent /* used in LifeHelperApp */,
  parent /* used in LifeHelperApp */
) {
  // *** dataServer is the URL of the server that provides the data.
  var [, , , toggleRefreshData, dataServer] = useGlobalState();

  var [populateDetail, setPopulateDetail] = createSignal(false);

  console.log(`In ProjectItem rendering item with name ${item.item_name}`);
  return (
    <div
      data-item_id={item.item_id}
      data-item_name={item.item_name}
      onDblClick={openChildren}
    >
      <input type="checkbox" name={item.item_id} id={item.item_id} />
      <div class="item-header">
        <label
          onClick={() => {
            if (populateDetail() == false) setPopulateDetail(!populateDetail());
          }}
          for={item.item_id}
          classList={{
            completed: item.completed_dtm,
            started: item.started_dtm,
          }}
        >
          {item.item_name}
        </label>

        {props.itemType != "task" ? (
          <button
            class="children"
            onClick={openChildren}
          >{`${capitalizeFirstLetter(childItemType(props.itemType))}s`}</button>
        ) : null}
      </div>
      <ProjectItemDetail
        readData={populateDetail}
        itemType={props.itemType}
        item_id={item.item_id}
      />
    </div>
  );

  // helper functions for the code above

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }

  function openChildren(event) {
    if (props.itemType == "task") return;

    setParent(() => {
      parent().push({
        item_id: item.item_id,
        item_name: item.item_name,
      });

      return parent();
    });

    // Before we refresh the data, we need to set the itemType to the next level.
    props.setItemType(childItemType(props.itemType));
    toggleRefreshData();
  }
}
