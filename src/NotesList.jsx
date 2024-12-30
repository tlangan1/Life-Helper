import "./NoteList.css";

import { createSignal, createResource, For } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";
import { AddNote } from "./AddNote";

export function NoteList(props) {
  var { itemType, dataServer } = useGlobalState();
  var [refreshNotes, setRefreshNotes] = createSignal(0);
  const [notes, { mutate, refetch }] = createResource(refreshNotes, fetchItems);

  return (
    <div class="notes-list">
      <AddNote item={props.item} toggleRefreshNotes={toggleRefreshNotes} />
      <span>{notes.loading && "Loading..."}</span>
      <span>{notes.error && "Error"}</span>
      {notes.state == "ready" && (
        <ul>
          <For each={notes()}>
            {(note) => <li class="note">{note.note}</li>}
          </For>
        </ul>
      )}
    </div>
  );

  // *** Helper functions for the code above

  function toggleRefreshNotes() {
    console.log("This should come second: toggleRefreshNotes");
    setRefreshNotes((refreshNotes() + 1) % 2);
  }

  async function fetchItems(source, { value, refetching }) {
    console.log("This should come third: fetchItems");
    if (refetching) {
      return value;
    }

    var searchParams = { item_id: props.item().item_id, item_type: itemType() };

    var response = await fetch(
      `${dataServer}/notes?params=${JSON.stringify(searchParams)}`
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
