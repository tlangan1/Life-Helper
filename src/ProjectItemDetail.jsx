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
import { createResource, createSignal, createEffect } from "solid-js";
import { affectItem } from "./helperFunctions";

export function ProjectItemDetail(props) {
  var { itemType, dataServer, toggleRefreshData } = useGlobalState();
  const [itemDetails] = createResource(props.populateDetail, fetchItemDetails);
  var [contentEditable, setContentEditable] = createSignal(false);
  createEffect(() => {
    if (!contentEditable()) {
      console.log("contentEditable is false");
    }
  });

  return (
    <div class="project-item-detail">
      {/* <h3>
        Product Item Detail for {props.item_type}
        with id = {props.item_id}
      </h3> */}
      <div class="item-controls">
        {props.itemType() == "task" ? (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_task_${props.item.item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "start",
                  props.itemType(),
                  { item_id: props.item.item_id },
                  dataServer
                )
              }
              disabled={props.item.completed_dtm}
              checked={props.item.started_dtm}
            ></input>
            <label for={`start_task_${props.item.item_id}`}>Start</label>
            <input
              type="checkbox"
              id={`pause_task_${props.item.item_id}`}
            ></input>
            <label for={`pause_task_${props.item.item_id}`}>Pause</label>
            <input
              type="checkbox"
              id={`complete_task_${props.item.item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "complete",
                  props.itemType(),
                  { item_id: props.item.item_id },
                  dataServer
                )
              }
            ></input>
            <label for={`complete_task_${props.item.item_id}`}>complete</label>
          </div>
        ) : (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_task_${props.item.item_id}`}
              disabled
            ></input>
            <label for={`started_item_${props.item.item_id}`}>Started</label>
            <input
              type="checkbox"
              id={`complete_task_${props.item.item_id}`}
              disabled
            ></input>
            <label for={`completed_item_${props.item.item_id}`}>
              completed
            </label>
          </div>
        )}
        <div class="cancel-item-control">
          <label for={`cancel_delete_task_${props.item.item_id}`}>
            Cancel/Delete
          </label>
          <input
            type="checkbox"
            id={`cancel_task_${props.item.item_id}`}
            onClick={(event) =>
              affectItemCaller(
                event,
                "cancel_delete",
                props.itemType(),
                { item_id: props.item.item_id },
                dataServer
              )
            }
          ></input>
        </div>
      </div>
      <span>{itemDetails.loading && "Loading..."}</span>
      <span>{itemDetails.error && "Error"}</span>
      {itemDetails.state == "ready" && (
        <div class="description">
          <button class="editable" onClick={toggleContentEditable}></button>
          Description:{" "}
          <span contentEditable={contentEditable()}>
            {" "}
            {itemDetails()[0].item_description}
          </span>
        </div>
      )}
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      item_id: props.item.item_id,
    });

    var response = await fetch(
      dataServer + `/${itemType()}s` + "?params=" + searchParams
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

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    var success = await affectItem(e, operation, item_type, data, dataServer);
    // TODO 1: instead of returning the success or failure I should
    // read the item and replace the array entry for just that item.
    // Get rid of everything from here to TODO 1 End:
    if (success) {
      // TODO: Replace this with a granular update design.
      toggleRefreshData();
    } else {
      // TODO: make sure the checkbox is unchecked.
      e.target.checked = false;
    }
    // TODO 1 End:
    // TODO 2: Get rid of this signal. Refetch the detail every time it is expanded.
    props.setPopulateDetail(!props.populateDetail());
  }

  function toggleContentEditable() {
    setContentEditable(!contentEditable());
    document
      .querySelector(
        `div[data-item_id="${props.item.item_id}"] button.editable`
      )
      .classList.toggle("editing");
  }
}
