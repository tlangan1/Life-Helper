import { Show, For, createSignal, createResource } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

function LifeHelperApp() {
  var [requestTodos, setRequestTodos] = createSignal(false);
  var [, , dataServer] = useGlobalState();

  console.log("Data Server", dataServer);

  const fetchTodos = async () => (await fetch(dataServer + "/todos")).json();
  const [todos] = createResource(requestTodos, fetchTodos);

  setRequestTodos(true);

  console.log("todos.state is ", todos.state);

  //   function postTask(evt) {
  //     // post body data
  //     const task = {
  //       task_list_id: 1, // TODO create a task_list_id control
  //       task_name: evt.target.value,
  //       task_description: "This is a full description of the task", // TODO create a task_description control
  //     };

  //     // request options
  //     const options = {
  //       method: "POST",
  //       body: JSON.stringify(task),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     // send POST request
  //     fetch(dataServer + "/Addtask", options)
  //       .then((res) => res.json())
  //       .then((res) => console.log(res));
  //   }

  function postObjective(evt) {
    // post body data
    const task = {
      name: evt.target.value,
      description: "This is a description of an objective", // TODO create a task_description control
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
    fetch(dataServer + "/AddObjective", options)
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  return (
    <section class="todoapp">
      <header class="header">
        <h1>TODOs</h1>
        <input
          class="new-todo"
          onChange={(e) => {
            // setTodos((todos) => [...todos, e.target.value]);
            // e.target.value = "";

            // postTodo(e);
            // postTask(e);
            postObjective(e);
          }}
          placeholder="What needs to be done?"
        />
      </header>
      <span>{todos.loading && "Loading..."}</span>
      <span>{todos.error && "Error"}</span>
      {todos.state == "ready" && (
        <Show when={todos().length > 0}>
          <ul class="todo-list">
            <For each={todos()}>
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
