import { createSignal, createResource, For } from "solid-js";

import "./CSS/ThoughtStack.css";

import { useGlobalState } from "./GlobalStateProvider";
import { AddThought } from "./AddThought";

import { affectItem } from "./JS/helperFunctions";

export function ThoughtStack(props) {
  var { user, dataServer } = useGlobalState();
  var [refreshThoughts, setRefreshThoughts] = createSignal(true);
  const [thoughts, { mutate, refetch }] = createResource(
    refreshThoughts,
    fetchThoughts
  );

  // The signal addOrUpdateRequested has three possible values: "add", "update", or false.
  // "add" means the user is adding a new thought.
  // "update" means the user is updating an existing thought.
  // false means the user is not adding or updating a thought.
  // The values "add" and "update" map directly to the routes the
  // data server expects, THEY WERE NOT RANDOMLY CHOSEN.
  var [addOrUpdateRequested, setAddOrUpdateRequested] = createSignal(false);

  // The signal thoughtToEdit is an object that contains the id and text
  // of the thought to be edited. This object is JSON.strigified
  // and passed to the data server which passes it on to the database.
  // The data server expects the object to have the following format:
  // { thought_id: <integer>, thought: <string> }
  var [thoughtToEdit, setThoughtToEdit] = createSignal({});

  return (
    <div class="route">
      <AddThought
        toggleRefreshThoughts={toggleRefreshThoughts}
        addOrUpdateRequested={addOrUpdateRequested}
        setAddOrUpdateRequested={setAddOrUpdateRequested}
        thoughtToEdit={thoughtToEdit}
        setThoughtToEdit={setThoughtToEdit}
      />
      <span>{thoughts.loading && "Loading..."}</span>
      <span>{thoughts.error && "Error"}</span>
      {thoughts.state == "ready" && (
        <ol>
          <For each={thoughts()}>
            {(thought) => (
              <li
                id={thought.thought_id}
                key={thought.thought_id}
                class="complex-list-item"
              >
                <span
                  innerHTML={
                    thought.thought
                    // mode == "dev" ? thought.thought_id : ""
                  }
                ></span>
                <div>
                  <button
                    onClick={(e) => {
                      setThoughtToEdit({
                        thought_id: thought.thought_id,
                        thought: thought.thought,
                      });
                      setAddOrUpdateRequested("update");
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={(e) => deleteThought(e, thought.thought_id)}>
                    ✖
                  </button>
                </div>
              </li>
            )}
          </For>
        </ol>
      )}
    </div>
  );

  // *** Helper functions for the code above

  function toggleRefreshThoughts() {
    setRefreshThoughts((refreshThoughts() + 1) % 2);
  }

  async function fetchThoughts(source, { value, refetching }) {
    if (refetching) {
      return value;
    }

    var searchParams = { user_login_id: user().user_login_id };

    var response = await fetch(
      `${dataServer}/get_items/thoughts?params=${JSON.stringify(searchParams)}`
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

  async function deleteThought(e, thought_id) {
    var dataSent = { thought_id: thought_id, update_type: "delete" };

    var dataReturned = await affectItem(
      "update",
      "thought",
      dataSent,
      dataServer
    );

    if (dataReturned.success) {
      // Remove the thought from the list
      var newThoughts = thoughts().filter(
        (thought) => thought.thought_id != thought_id
      );
      mutate(newThoughts);
    }
    if (!dataReturned.success) {
      alert(
        `An error occurred with this request. Please try again. If the problem persists, contact the system administrator. The response status code is ${response.status}. ${response.statusText}`
      );
    }
  }
}
