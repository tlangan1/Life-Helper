import "./CSS/ProjectItemDetail.css";

import { useGlobalState } from "./GlobalStateProvider";
import { createSignal } from "solid-js";
import { affectItem } from "./JS/helperFunctions";
import { NoteList } from "./NotesList";

export function ProjectItemDetail(props) {
  var {
    loggedIn,
    user,
    setUser,
    itemType,
    dataServer,
    toggleRefreshData,
    filters,
  } = useGlobalState();
  var [notesRequested, setNotesRequested] = createSignal(false);

  return (
    <div class="project-item-detail">
      <div class="item-controls">
        {itemType() == "task" ? (
          <div class="non-cancel-item-controls">
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
          </div>
        ) : (
          <div class="non-cancel-item-controls">
            <div>
              <input
                type="checkbox"
                id={`started_item_${props.item().item_id}`}
                disabled
                checked={props.item().started_dtm}
              ></input>
              <label for={`started_item_${props.item().item_id}`}>
                Started
              </label>
            </div>
            <div>
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
      var property_name = "user_working";
      var property_value = user().user_working;
      switch (updateType) {
        case "start":
          property_value = true;
          break;
        case "pause":
          property_value = false;
          break;
        case "resume":
          property_value = true;
          break;
        case "complete":
          property_value = false;
          break;
        case "cancel_delete":
          break;
        default:
          break;
      }
      setUser(updateUser(property_name, property_value));
    } else {
      target.checked = updateType == "resume" ? true : false;
    }
  }

  function fullRefreshRequired(operation, filters) {
    return (
      operation == "cancel_delete" ||
      operation == "start" ||
      operation == "resume" ||
      (operation == "complete" && !filters().include_completed_items)
    );
  }

  function updateUser(property_name, property_value) {
    var new_user = { ...user() };
    new_user[property_name] = property_value;
    return new_user;
  }
}
