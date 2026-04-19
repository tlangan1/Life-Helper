import "./CSS/ProjectItemDetail.css";

import { useGlobalState } from "./GlobalStateProvider";
import { createSignal, Show } from "solid-js";
import { affectItem } from "./JS/helperFunctions";
import { NoteList } from "./NotesList";
import { ReassignTaskModal } from "./ReassignTaskModal";

export function ProjectItemDetail(props) {
  var {
    loggedIn,
    user,
    setUser,
    itemType,
    dataServer,
    toggleRefreshData,
    filters,
    showToast,
  } = useGlobalState();
  var [notesRequested, setNotesRequested] = createSignal(false);
  var [reassignRequested, setReassignRequested] = createSignal(false);
  var [reassignUsers, setReassignUsers] = createSignal([]);
  var [loadingReassignUsers, setLoadingReassignUsers] = createSignal(false);

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
                    dataServer,
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
                    {
                      item_id: props.item().item_id,
                      user_login_id: user().user_login_id,
                    },

                    dataServer,
                  )
                }
                disabled={
                  props.item().completed_dtm ||
                  props.item().canceled_dtm ||
                  !loggedIn() ||
                  props.item().user_login_id != user().user_login_id
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
                    {
                      item_id: props.item().item_id,
                      user_login_id: user().user_login_id,
                    },
                    dataServer,
                  )
                }
                disabled={
                  props.item().completed_dtm ||
                  props.item().canceled_dtm ||
                  !loggedIn() ||
                  props.item().user_login_id != user().user_login_id
                }
                checked={props.item().completed_dtm}
              ></input>
              <label for={`complete_item_${props.item().item_id}`}>
                Complete
              </label>
            </div>
            <div>
              <button
                class="action-button inline"
                title="Reassign this task to another user"
                onClick={openReassignModal}
                disabled={!canReassign() || loadingReassignUsers()}
              >
                {loadingReassignUsers() ? "Loading users..." : "Reassign"}
              </button>
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
          <label for={`cancel_item_${props.item().item_id}`}>Cancel</label>
          <input
            type="checkbox"
            id={`cancel_item_${props.item().item_id}`}
            onClick={(event) =>
              affectItemCaller(
                event.target,
                "cancel",
                itemType(),
                {
                  item_type: itemType(),
                  item_id: props.item().item_id,
                  user_login_id: user().user_login_id,
                },
                dataServer,
              )
            }
            disabled={
              props.item().completed_dtm ||
              props.item().canceled_dtm ||
              !loggedIn() ||
              props.item().user_login_id != user().user_login_id
            }
            checked={props.item().canceled_dtm}
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
      <ReassignTaskModal
        open={reassignRequested}
        onClose={() => setReassignRequested(false)}
        task={props.item}
        users={reassignUsers}
        currentUser={user}
        showToast={showToast}
        onSubmit={submitReassignment}
      />
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      //   parent_id: props.parent()[props.parent().length - 1].item_id,
      item_id: props.item().item_id,
    });

    var response = await fetch(
      dataServer + `/get_items/${itemType()}` + "?params=" + searchParams,
    );
    if (!response.ok) {
      showToast(
        `Server Error: status is ${response.status} reason is ${response.statusText}`,
      );
    } else {
      var data = await response.json();
      return data[0];
    }
  }

  async function affectItemCaller(
    target,
    updateType,
    itemType,
    sentData,
    dataServer,
  ) {
    sentData.update_type = updateType;
    var result = await affectItem(
      "update",
      itemType,
      sentData,
      dataServer,
      user,
    );
    // Granular update strategy.
    // Return the success or failure of the update operation.
    // If successful, fetch the item and update the item signal.
    if (result.success) {
      if (fullRefreshRequired(updateType, filters)) {
        toggleRefreshData();
      } else {
        var updatedItem = await fetchItemDetails();
        props.setItem(updatedItem);
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
        case "cancel":
          break;
        default:
          break;
      }
      setUser(updateUser(property_name, property_value));
    } else {
      showToast(result.error);
      target.checked = updateType == "resume" ? true : false;
    }
  }

  function canReassign() {
    return (
      itemType() == "task" &&
      loggedIn() &&
      !props.item().completed_dtm &&
      !props.item().canceled_dtm &&
      props.item().user_login_id == user().user_login_id
    );
  }

  async function openReassignModal() {
    if (!canReassign()) return;

    setLoadingReassignUsers(true);
    try {
      await loadAssignableUsers();
      setReassignRequested(true);
    } finally {
      setLoadingReassignUsers(false);
    }
  }

  async function loadAssignableUsers() {
    var response = await fetch(
      `${dataServer}/get_items/user_logins?params=${JSON.stringify({})}`,
    );
    if (!response.ok) {
      showToast(
        `Server Error: status is ${response.status} reason is ${response.statusText}`,
      );
      setReassignUsers([]);
      return;
    }

    var users = await response.json();
    var normalizedUsers = users.map((u) => ({
      user_login_id: u.user_login_id,
      display_name: u.display_name || u.user_name || "Unknown user",
      email_address: u.email_address || "",
      active: u.active == undefined ? true : !!u.active,
      workload: u.workload ?? 0,
    }));

    setReassignUsers(normalizedUsers);
  }

  async function submitReassignment(payload) {
    var result = await affectItem("update", "task", payload, dataServer, user);
    if (result.success) {
      toggleRefreshData();
      return { success: true };
    }

    return { success: false, error: result.error };
  }

  function fullRefreshRequired(operation, filters) {
    return (
      operation == "cancel" ||
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
