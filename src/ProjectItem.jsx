import "./ProjectItem.css";

import { createSignal } from "solid-js";

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
  var [item, setItem] = createSignal(props.item);

  var [populateDetail, setPopulateDetail] = createSignal(false);

  console.log(`In ProjectItem rendering item with name ${item().item_name}`);
  return (
    <div
      data-item_id={item().item_id}
      data-item_name={item().item_name}
      onDblClick={openChildren}
    >
      <input type="checkbox" name={item().item_id} id={item().item_id} />
      <div class="item-header">
        <label
          onClick={() => {
            if (populateDetail() == false) setPopulateDetail(!populateDetail());
          }}
          for={item().item_id}
          classList={{
            completed: item().completed_dtm,
            started: setStartedClass(item),
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
        populateDetail={populateDetail}
        setPopulateDetail={setPopulateDetail}
        itemType={itemType}
        item={item}
        setItem={setItem}
        items={props.items}
        mutate={props.mutate}
        refetch={props.refetch}
      />
    </div>
  );

  // helper functions for the code above

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }

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

  function setStartedClass(item) {
    console.log(`item_id is ${item().item_id}`);
    // item().started_dtm = "1/1/2021";
    // uncomment the line above and then check out props.items()[0].started_dtm
    // in the browser console and you will see that "item" is a signal into the items in ListItems.
    return item().started_dtm;
  }
}
