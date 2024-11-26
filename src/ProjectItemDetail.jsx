// This is the code that was once in ProjectItem.jsx used to delete an item.
// {
//   <button
//     class="destroy"
//     onClick={(e) => {
//       affectItemCaller(
//         e,
//         "delete",
//         props.itemType,
//         { item_id: item.item_id },
//         dataServer
//       );
//     }}
//   />;
// }

// This is the code that was once in ProjectItem.jsx used to start a task.
// {
//   <div class="toggle">
//     {props.itemType == "task" ? (
//       <input
//         type="checkbox"
//         class="toggle"
//         onClick={(e) => {
//           affectItemCaller(
//             e,
//             "start",
//             props.itemType,
//             { item_id: item.item_id },
//             dataServer
//           );
//         }}
//         disabled={item.completed_dtm}
//         checked={item.started_dtm}
//       ></input>
//     ) : (
//       <input type="checkbox" class="toggle" disabled></input>
//     )}
//     <span class="hide">Start</span>
//   </div>;
// }

import "./ProjectItemDetail.css";

import { displayObjectKeysAndValues } from "./diagnostic";

import { useGlobalState } from "./GlobalStateProvider";
import { createResource, createSignal } from "solid-js";
import { affectItem } from "./helperFunctions";

export function ProjectItemDetail(props) {
  // *** The SolidJS resource item_details is used to store the details of the item
  // *** retrieved from the server depending on the type and id.
  displayObjectKeysAndValues("ProjectItemDetail", props);
  // *** dataServer is the URL of the server that provides the data.
  var [, , refreshData, toggleRefreshData, dataServer] = useGlobalState();
  const [itemDetails] = createResource(props.readData, fetchItemDetails);
  //   setRefreshDetailData(1);

  return (
    <div class="project-item-detail">
      {/* <h3>
        Product Item Detail for {props.item_type}
        with id = {props.item_id}
      </h3> */}
      <div class="item-controls">
        {props.itemType == "task" ? (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_task_${props.item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "start",
                  props.itemType,
                  { item_id: props.item_id },
                  dataServer
                )
              }
              //   disabled={item.completed_dtm}
              //   checked={item.started_dtm}
            ></input>
            <label for={`start_task_${props.item_id}`}>Start</label>
            <input type="checkbox" id={`pause_task_${props.item_id}`}></input>
            <label for={`pause_task_${props.item_id}`}>Pause</label>
            <input type="checkbox" id={`finish_task_${props.item_id}`}></input>
            <label for={`finish_task_${props.item_id}`}>Finish</label>
          </div>
        ) : (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_task_${props.item_id}`}
              disabled
            ></input>
            <label for={`started_item_${props.item_id}`}>Started</label>
            <input
              type="checkbox"
              id={`finish_task_${props.item_id}`}
              disabled
            ></input>
            <label for={`finished_item_${props.item_id}`}>Finished</label>
          </div>
        )}
        <div class="cancel-item-control">
          <label for={`cancel_delete_task_${props.item_id}`}>
            Cancel/Delete
          </label>
          <input type="checkbox" id={`cancel_task_${props.item_id}`}></input>
        </div>
      </div>
      <span>{itemDetails.loading && "Loading..."}</span>
      <span>{itemDetails.error && "Error"}</span>
      {itemDetails.state == "ready" && (
        <div>Description: {itemDetails()[0].item_description}</div>
      )}
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      item_id: props.item_id,
    });

    var response = await fetch(
      dataServer + `/${props.itemType}s` + "?params=" + searchParams
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      var data = await response.json();
      return data;
    }
  }

  /* *** Helper functions *** */
  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    // toggleRefreshData();
  }
}
