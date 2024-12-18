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
  var [contentEditable, setContentEditable] = createSignal(false);

  var [item, setItem] = createSignal(props.item());

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
              id={`start_task_${item().item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "start",
                  props.itemType(),
                  { item_id: item().item_id },
                  dataServer
                )
              }
              disabled={item().completed_dtm}
              checked={item().started_dtm}
            ></input>
            <label for={`start_task_${item().item_id}`}>Start</label>
            <input type="checkbox" id={`pause_task_${item().item_id}`}></input>
            <label for={`pause_task_${item().item_id}`}>Pause</label>
            <input
              type="checkbox"
              id={`complete_task_${item().item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "complete",
                  props.itemType(),
                  { item_id: item().item_id },
                  dataServer
                )
              }
            ></input>
            <label for={`complete_task_${item().item_id}`}>complete</label>
          </div>
        ) : (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_task_${item().item_id}`}
              disabled
            ></input>
            <label for={`started_item_${item().item_id}`}>Started</label>
            <input
              type="checkbox"
              id={`complete_task_${item().item_id}`}
              disabled
            ></input>
            <label for={`completed_item_${item().item_id}`}>completed</label>
          </div>
        )}
        <div class="cancel-item-control">
          <label for={`cancel_delete_task_${item().item_id}`}>
            Cancel/Delete
          </label>
          <input
            type="checkbox"
            id={`cancel_task_${item().item_id}`}
            onClick={(event) =>
              affectItemCaller(
                event,
                "cancel_delete",
                props.itemType(),
                { item_id: item().item_id },
                dataServer
              )
            }
          ></input>
        </div>
      </div>
      <div class="description">
        <button class="editable" onClick={toggleContentEditable}></button>
        Description:{" "}
        <span contentEditable={contentEditable()}>
          {" "}
          {/* I need to transition this reference to items().task_description */}
          {/* The way to really do this is to return the column names */}
          {/* for objectives, goals and tasks to item... */}
          {/* So, instead of returning objective_description */}
          {/* , goal_description and task_description from the */}
          {/* stored procedure call I should cast the all to item_description */}
          {/* At the same time I should get rid of the whole detail fetch, etc. */}
          {/* {itemDetails()[0].item_description} */}
          {item().item_description}
        </span>
      </div>
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      item_id: item().item_id,
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
    // Return the success or failure of the operation.
    // If successful, fetch that item and update just that item
    // in the items held by ListItems. Then call refetch so that
    // ListItems can update just that one item in place.
    if (success) {
      // TODO: Replace this with a granular update design.
      // toggleRefreshData();
      var updatedItem = await fetchItemDetails();
      const newItems = props.items();
      item().started_dtm = updatedItem[0].started_dtm;
      //   props.mutate(newItems);
      //   props.refetch();
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
      .querySelector(`div[data-item_id="${item().item_id}"] button.editable`)
      .classList.toggle("editing");
  }
}
