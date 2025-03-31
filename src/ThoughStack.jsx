import { createSignal, createResource, For } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";
import { AddThought } from "./AddThought";

export function ThoughtStack(props) {
  var { mode, itemType, dataServer } = useGlobalState();
  var [refreshThoughts, setRefreshThoughts] = createSignal(true);
  const [thoughts, { mutate, refetch }] = createResource(
    refreshThoughts,
    fetchThoughts
  );

  return (
    <div class="route">
      <AddThought
        item={props.item}
        toggleRefreshThoughts={toggleRefreshThoughts}
      />
      <span>{thoughts.loading && "Loading..."}</span>
      <span>{thoughts.error && "Error"}</span>
      {thoughts.state == "ready" && (
        <ol>
          <For each={thoughts()}>
            {(thought) => (
              <li
                class="note"
                innerHTML={`${thought.thought} (${
                  mode == "dev" ? thought.thought_id : ""
                })`}
              ></li>
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

    var searchParams = {};

    var response = await fetch(
      `${dataServer}/thoughts?params=${JSON.stringify(searchParams)}`
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
}
