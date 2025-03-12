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
                  event.target,
                  "start",
                  itemType(),
                  {
                    item_id: props.item().item_id,
                    user_login_id: user().user_login_id,
                  },
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
                  event.target,
                  event.target.checked ? "pause" : "resume",
                  itemType(),
                  { item_id: props.item().item_id },
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
                  event.target,
                  "complete",
                  itemType(),
                  { item_id: props.item().item_id },
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
                event.target,
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
    target,
    updateType,
    itemType,
    sentData,
    dataServer
  ) {
    sentData.update_type = updateType;
    var returnedData = await affectItem(
      "update",
      itemType,
      sentData,
      dataServer,
      user
    );
    // Granular update strategy.
    // Return the success or failure of the update operation.
    // If successful, fetch the item and update the item signal.
    if (returnedData.success) {
      if (fullRefreshRequired(updateType, filters)) {
        toggleRefreshData();
      } else {
        var updatedItem = await fetchItemDetails();
        props.setItem(updatedItem[0]);
      }
    } else {
      target.checked = false;
    }
  }

  function fullRefreshRequired(operation, filters) {
    return (
      operation == "cancel_delete" ||
      (operation == "complete" && !filters().include_completed_items)
    );
  }
}
