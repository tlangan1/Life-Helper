import { createSignal, createResource, For } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

// Remember to do all local TODOs

export function TaskStack(props) {
  var { mode, dataServer, user } = useGlobalState();
  var [refreshTaskStack, setRefreshTaskStack] = createSignal(0);
  var [refreshStartedTasks, setRefreshStartedTasks] = createSignal(true);
  const [startedTasks] = createResource(refreshStartedTasks, fetchStartedTasks);
  const [stackedTasks] = createResource(refreshTaskStack, fetchTaskStack);

  return (
    <section class="route">
      <select id="started_tasks">
        {startedTasks.state == "ready" && (
          <For each={startedTasks()}>
            {(task) => (
              <option
                // TODO these option elements may need a class for styling purposes
                // class="note"
                innerHTML={`${task.item_name} (${
                  mode == "dev" ? task.task_id : ""
                })`}
              ></option>
            )}
          </For>
        )}
      </select>

      <span>{stackedTasks.loading && "Loading..."}</span>
      <span>{stackedTasks.error && "Error"}</span>
      {stackedTasks.state == "ready" && (
        <ol>
          <For each={stackedTasks()}>
            {(task) => (
              <li
                // TODO these li elements may need a class for styling purposes
                class="note"
                // TODO: indicate the goal(s) that the task is associated with
                innerHTML={`${task.note} (${
                  mode == "dev" ? task.note_id : ""
                })`}
              ></li>
            )}
          </For>
        </ol>
      )}
    </section>
  );

  // *** Helper functions for the code above

  // TODO: replace modular arithmetic with a boolean
  function toggleRefreshTaskStack() {
    setRefreshTaskStack((refreshTaskStack() + 1) % 2);
  }

  async function fetchTaskStack() {
    var searchParams = JSON.stringify({
      assigned_to: user().user_login_id,
    });

    var response = await fetch(
      `${dataServer}/stacked_tasks?params=${JSON.stringify(searchParams)}`
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

  function toggleRefreshStartedTasks() {
    setRefreshStartedTasks(!refreshStartedTasks());
  }

  async function fetchStartedTasks() {
    var searchParams = JSON.stringify({
      view: "my-tasks-view",
      assigned_to: user().user_login_id,
      completed_items: "no",
      deleted_items: "no",
    });

    var response = await fetch(
      dataServer + `/tasks` + "?params=" + searchParams
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
