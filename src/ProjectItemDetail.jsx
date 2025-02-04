import "./CSS/ProjectItemDetail.css";

import { useGlobalState } from "./GlobalStateProvider";
import { createSignal } from "solid-js";
import { affectItem } from "./JS/helperFunctions";
import { NoteList } from "./NotesList";

export function ProjectItemDetail(props) {
  var { loggedIn, user, itemType, dataServer, toggleRefreshData, filters } =
    useGlobalState();
  var [notesRequested, setNotesRequested] = createSignal(false);

  return (
    <div class="project-item-detail">
      <div class="item-controls">
        {itemType() == "task" ? (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`start_item_${props.item().item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "start",
                  itemType(),
                  { task_id: props.item().item_id },
                  dataServer
                )
              }
              disabled={props.item().started_dtm || !loggedIn()}
              checked={props.item().started_dtm}
            ></input>
            <label for={`start_item_${props.item().item_id}`}>Start</label>
            <input
              type="checkbox"
              id={`pause_item_${props.item().item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "pause",
                  itemType(),
                  { task_id: props.item().item_id },
                  dataServer
                )
              }
              disabled={
                props.item().completed_dtm ||
                props.item().deleted_dtm ||
                !loggedIn()
              }
              checked={props.item().paused_dtm}
            ></input>
            <label for={`pause_item_${props.item().item_id}`}>Pause</label>
            <input
              type="checkbox"
              id={`complete_item_${props.item().item_id}`}
              onClick={(event) =>
                affectItemCaller(
                  event,
                  "complete",
                  itemType(),
                  { task_id: props.item().item_id },
                  dataServer
                )
              }
              disabled={
                props.item().completed_dtm ||
                props.item().deleted_dtm ||
                !loggedIn()
              }
              checked={props.item().completed_dtm}
            ></input>
            <label for={`complete_item_${props.item().item_id}`}>
              Complete
            </label>
          </div>
        ) : (
          <div class="non-cancel-item-controls">
            <input
              type="checkbox"
              id={`started_item_${props.item().item_id}`}
              disabled
              checked={props.item().started_dtm}
            ></input>
            <label for={`started_item_${props.item().item_id}`}>Started</label>
            <input
              type="checkbox"
              id={`completed_item_${props.item().item_id}`}
              disabled
              checked={props.item().completed_dtm}
            ></input>
            <label for={`completed_item_${props.item().item_id}`}>
              Completed
            </label>
          </div>
        )}
        <div class="cancel-item-control">
          <label for={`cancel_delete_item_${props.item().item_id}`}>
            Cancel/Delete
          </label>
          <input
            type="checkbox"
            id={`cancel_delete_item_${props.item().item_id}`}
            onClick={(event) =>
              affectItemCaller(
                event,
                "cancel_delete",
                itemType(),
                { item_type: itemType(), item_id: props.item().item_id },
                dataServer
              )
            }
            disabled={
              props.item().completed_dtm ||
              props.item().deleted_dtm ||
              !loggedIn()
            }
            checked={props.item().deleted_dtm}
          ></input>
        </div>
      </div>
      <div class="description">
        <input
          type="checkbox"
          name={`showAllNotes${props.item().item_id}`}
          id={`showAllNotes${props.item().item_id}`}
          role="button"
          onClick={() => setNotesRequested(!notesRequested())}
        />
        <label for={`showAllNotes${props.item().item_id}`}>Description:</label>
        {props.item().item_description}
        <Show when={notesRequested()}>
          <NoteList item={props.item} />
        </Show>
      </div>
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      parent_id: props.parent()[props.parent().length - 1].item_id,
      item_id: props.item().item_id,
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

  async function affectItemCaller(
    e,
    operation,
    item_type,
    sentData,
    dataServer
  ) {
    var returnedData = await affectItem(
      e,
      operation,
      item_type,
      sentData,
      dataServer,
      user
    );
    // Granular update strategy.
    // Return the success or failure of the update operation.
    // If successful, fetch the item and update the item signal.
    if (returnedData.success) {
      if (fullRefreshRequired(operation, filters)) {
        toggleRefreshData();
      } else {
        var updatedItem = await fetchItemDetails();
        props.setItem(updatedItem[0]);
      }
    } else {
      e.target.checked = false;
    }
  }

  function fullRefreshRequired(operation, filters) {
    return (
      operation == "cancel_delete" ||
      (operation == "complete" && !filters().include_completed_items)
    );
  }
}
