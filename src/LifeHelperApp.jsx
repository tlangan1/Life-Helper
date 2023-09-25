import { Show, For, createSignal, createResource } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

function LifeHelperApp() {
  var [refreshData, setRefreshData] = createSignal(0);
  var [, , dataServer] = useGlobalState();

  console.log("Data Server", dataServer);

  const fetchObjectives = async () =>
    (await fetch(dataServer + "/objectives")).json();

  const [objectives] = createResource(refreshData, fetchObjectives);

  async function postObjective(evt) {
    // post body data
    const task = {
      name: evt.target.value,
      description: "This is a description of an objective", // TODO create an objective description control
    };

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // send POST request
    await fetch(dataServer + "/AddObjective", options);

    setRefreshData(refreshData() + 1);
    evt.target.value = "";
  }

  return (
    <section class="todoapp">
      <header class="header">
        <h1>Objectives</h1>
        <input
          class="new-todo"
          onChange={(e) => postObjective(e)}
          placeholder="Enter an objective"
        />
      </header>
      <span>{objectives.loading && "Loading..."}</span>
      <span>{objectives.error && "Error"}</span>
      {objectives.state == "ready" && (
        <Show when={objectives().length > 0}>
          <ul class="todo-list">
            <For each={objectives()}>
              {(todo) => (
                <li class="todo">
                  <div class="view">
                    <input type="checkbox" class="toggle"></input>
                    <label>{todo}</label>
                    <button class="destroy" />
                  </div>
                </li>
              )}
            </For>
          </ul>
        </Show>
      )}
    </section>
  );
}

export default LifeHelperApp;
