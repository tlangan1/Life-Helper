import "./AddNote.css";

import { createEffect, createSignal } from "solid-js";
import { Show } from "solid-js/web";

import { useGlobalState } from "./GlobalStateProvider";

import { affectItem } from "./helperFunctions";

export function AddNote(props) {
  var noteText;
  var [AddNote, setAddNote] = createSignal(false);
  var { dataServer, itemType } = useGlobalState();
  createEffect(() => {
    if (AddNote()) document.querySelector("dialog").showModal();
  });
  var [noteLength, setNoteLength] = createSignal(0);
  var minTextLength = 15;
  var maxTextLength = 1000;

  return (
    <>
      <div class="add-note-buttons">
        <button
          class="action-button"
          title="Click here to add a new note"
          onClick={toggleAddNote}
        >
          ✏️ Add a note
        </button>
      </div>
      <Show when={AddNote()}>
        <dialog class="popup">
          <label htmlFor="note_text" class="block">
            Note Text (Required):
          </label>
          <textarea
            ref={noteText}
            name="note_text"
            id="note_text"
            required
            autofocus
            minLength={minTextLength}
            maxLength={maxTextLength}
            onKeyUp={(e) => setNoteLength(e.target.value.length)}
            rows="5"
            cols="50"
          ></textarea>
          <span class="block">
            {noteLength() < minTextLength
              ? `${minTextLength - noteLength()} more characters required`
              : `${maxTextLength - noteLength()} more characters available`}
          </span>
          <div>
            <button
              class="action-button"
              onClick={(e) => {
                affectItemCaller(
                  e,
                  "add",
                  "note",
                  {
                    item_type: itemType(),
                    parent_id: props.item().item_id,
                    note_text: noteText.value,
                  },
                  dataServer
                );
              }}
              disabled={noteLength() < minTextLength}
            >
              Save Note
            </button>
            <button class="action-button" onClick={toggleAddNote}>
              Cancel
            </button>
          </div>
        </dialog>
      </Show>
    </>
  );

  function toggleAddNote() {
    setAddNote(!AddNote());
  }

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    var success = await affectItem(e, operation, item_type, data, dataServer);
    if (success) {
      toggleAddNote();
      props.toggleRefreshNotes();
    }
  }
}
