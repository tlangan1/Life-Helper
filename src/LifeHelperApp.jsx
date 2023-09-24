import { Show, For, createSignal, createResource } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

function LifeHelperApp() {
  //   const [todos, setTodos] = createSignal([]);
  var [requestTodos, setRequestTodos] = createSignal(false);
  var [, , dataServer] = useGlobalState();

  console.log("Data Server", dataServer);

  const fetchTodos = async () => (await fetch(dataServer + "/todos")).json();
  const [todos] = createResource(requestTodos, fetchTodos);

  setRequestTodos(true);

  console.log("todos.state is ", todos.state);

  function postTodo(evt) {
    // post body data
    const todo = {
      todo_name: evt.target.value,
    };

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // send POST request
    fetch(dataServer + "/Addtodo", options)
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

            postTodo(e);
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
